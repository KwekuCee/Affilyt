import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function upsertOrderFromCharge(
  supabase: ReturnType<typeof createClient>,
  data: Record<string, any>,
  reference: string,
) {
  try {
    const { data: existing } = await supabase
      .from('orders').select('id').eq('payment_reference', reference).maybeSingle()
    if (existing) return

    const metadata = data.metadata || {}
    let product: { commission_rate: number; seller_id: string | null } | null = null
    if (metadata.product_id) {
      const { data: p } = await supabase
        .from('products').select('commission_rate, seller_id')
        .eq('id', metadata.product_id).maybeSingle()
      product = p as any
    }

    const amount = Number(data.amount) || 0
    let commissionAmount = 0
    const orderData: Record<string, unknown> = {
      product_id: metadata.product_id || null,
      buyer_email: data.customer?.email || metadata.buyer_email || 'unknown',
      amount, status: 'completed', payment_reference: reference,
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
      .from('orders').insert(orderData).select().single()
    if (orderError) {
      if ((orderError as any).code === '23505') return
      console.error('Order insert error:', orderError); return
    }
    if (order && metadata.affiliate_id && commissionAmount > 0) {
      await supabase.from('commissions').insert({
        affiliate_id: metadata.affiliate_id, order_id: order.id,
        amount: commissionAmount, status: 'pending',
      })
    }
  } catch (e) { console.error('upsertOrderFromCharge failed:', e) }
}

// Korapay signs the JSON-stringified `data` object with HMAC-SHA256 using
// your live secret key. The signature arrives in the `x-korapay-signature`
// header. See: https://developers.korapay.com/docs/webhooks
async function verifyKorapaySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false
  let payload: any
  try { payload = JSON.parse(rawBody) } catch { return false }
  const data = payload?.data
  if (!data) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(JSON.stringify(data)))
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('')
  // Constant-time compare
  if (hex.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const secret = Deno.env.get('KORAPAY_SECRET_KEY')
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const raw = await req.text()
    const signature = req.headers.get('x-korapay-signature')
    const valid = await verifyKorapaySignature(raw, signature, secret)
    if (!valid) {
      console.warn('korapay-webhook: invalid signature')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = JSON.parse(raw)
    const event: string = body?.event || 'unknown'
    const data = body?.data || {}

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Audit trail
    await supabase.from('activity_events').insert({
      type: `korapay.${event}`,
      message: `Korapay webhook: ${event} (${data?.reference || 'no-ref'})`,
      metadata: { reference: data?.reference, amount: data?.amount, status: data?.status },
    })

    if (event === 'charge.success' && data?.reference) {
      await upsertOrderFromCharge(supabase, data, data.reference)
    }

    if ((event === 'charge.refund' || event === 'charge.refunded') && data?.reference) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_reference', data.reference)
        .maybeSingle()
      if (order) {
        await supabase.from('refunds').insert({
          order_id: order.id,
          amount: Number(data.amount) || 0,
          status: 'completed',
          reason: 'Korapay webhook refund',
        })
        await supabase.from('orders').update({ status: 'refunded' }).eq('id', order.id)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('korapay-webhook error:', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
