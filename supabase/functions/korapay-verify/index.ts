import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Client-triggered verification. Idempotent: safe to call multiple times
// and safe to race with the Korapay webhook. Uses `payment_reference` as
// the natural key on `orders`.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { reference } = await req.json().catch(() => ({}))
    if (!reference || typeof reference !== 'string') {
      return json({ error: 'reference is required' }, 400)
    }

    const secretKey = Deno.env.get('KORAPAY_SECRET_KEY')
    if (!secretKey) return json({ error: 'Payment gateway not configured' }, 500)

    const verifyRes = await fetch(
      `https://api.korapay.com/merchant/api/v1/charges/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    )
    const verifyData = await verifyRes.json().catch(() => ({}))
    if (!verifyRes.ok) {
      return json({ error: 'Verification failed', details: verifyData?.message || null }, 400)
    }

    const data = verifyData?.data || {}
    const status = String(data?.status || '').toLowerCase()
    const isSuccess = status === 'success'

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    if (isSuccess) {
      await upsertOrderFromCharge(supabase, data, reference)
    }

    return json({
      success: isSuccess,
      status: data?.status ?? 'unknown',
      amount: data?.amount ?? null,
      currency: data?.currency ?? null,
      reference: data?.reference ?? reference,
    })
  } catch (error) {
    console.error('korapay-verify error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Shared idempotent order writer. Exported semantics: never throws to caller
// path; logs and returns on error so verify/webhook can both call safely.
export async function upsertOrderFromCharge(
  supabase: ReturnType<typeof createClient>,
  data: Record<string, any>,
  reference: string,
) {
  try {
    // Idempotency: if we've already recorded this reference, do nothing.
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_reference', reference)
      .maybeSingle()
    if (existing) return

    const metadata = data.metadata || {}

    let product: { commission_rate: number; seller_id: string | null } | null = null
    if (metadata.product_id) {
      const { data: p } = await supabase
        .from('products')
        .select('commission_rate, seller_id')
        .eq('id', metadata.product_id)
        .maybeSingle()
      product = p as any
    }

    const amount = Number(data.amount) || 0
    let commissionAmount = 0
    const orderData: Record<string, unknown> = {
      product_id: metadata.product_id || null,
      buyer_email: data.customer?.email || metadata.buyer_email || 'unknown',
      amount,
      status: 'completed',
      payment_reference: reference,
    }

    if (metadata.affiliate_id) {
      orderData.affiliate_id = metadata.affiliate_id
      orderData.affiliate_link_id = metadata.affiliate_link_id || null
      if (product) {
        commissionAmount = (amount * Number(product.commission_rate)) / 100
        orderData.commission_amount = commissionAmount
      }
    }

    if (product?.seller_id) {
      const platformFee = amount * 0.10
      const sellerEarnings = amount - commissionAmount - platformFee
      orderData.seller_id = product.seller_id
      orderData.platform_fee = platformFee
      orderData.seller_earnings = sellerEarnings > 0 ? sellerEarnings : 0
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      // Unique-violation on payment_reference means another handler won the race.
      if ((orderError as any).code === '23505') return
      console.error('Order insert error:', orderError)
      return
    }

    if (order && metadata.affiliate_id && commissionAmount > 0) {
      await supabase.from('commissions').insert({
        affiliate_id: metadata.affiliate_id,
        order_id: order.id,
        amount: commissionAmount,
        status: 'pending',
      })
    }
  } catch (e) {
    console.error('upsertOrderFromCharge failed:', e)
  }
}
