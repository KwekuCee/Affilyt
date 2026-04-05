const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()
    if (!reference) {
      return new Response(JSON.stringify({ error: 'Reference is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const secretKey = Deno.env.get('KORAPAY_SECRET_KEY')
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify the transaction with Korapay
    const verifyRes = await fetch(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const verifyData = await verifyRes.json()

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: 'Verification failed', details: verifyData }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data } = verifyData
    const isSuccess = data?.status === 'success'

    // If successful, record the order in the database
    if (isSuccess) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, serviceRoleKey)

      const metadata = data.metadata || {}

      const orderData: Record<string, unknown> = {
        product_id: metadata.product_id,
        buyer_email: data.customer?.email || metadata.buyer_email || 'unknown',
        amount: data.amount,
        status: 'completed',
      }

      if (metadata.affiliate_id) {
        orderData.affiliate_id = metadata.affiliate_id
        orderData.affiliate_link_id = metadata.affiliate_link_id || null

        // Calculate commission
        const { data: product } = await supabase
          .from('products')
          .select('commission_rate')
          .eq('id', metadata.product_id)
          .single()

        if (product) {
          const commissionAmount = (data.amount * product.commission_rate) / 100
          orderData.commission_amount = commissionAmount
        }
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        console.error('Order insert error:', orderError)
      }

      // Create commission record if affiliate
      if (order && metadata.affiliate_id && orderData.commission_amount) {
        await supabase.from('commissions').insert({
          affiliate_id: metadata.affiliate_id,
          order_id: order.id,
          amount: orderData.commission_amount,
          status: 'pending',
        })
      }
    }

    return new Response(JSON.stringify({
      success: isSuccess,
      status: data?.status,
      amount: data?.amount,
      currency: data?.currency,
      reference: data?.reference,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Verification error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
