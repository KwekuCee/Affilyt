import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const event = body?.event
    const data = body?.data || {}

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabase.from('activity_events').insert({
      type: `korapay.${event}`,
      payload: data,
    })

    if (event === 'charge.success' && data.reference) {
      // Idempotent record — verify endpoint handles fuller insert
      await supabase.from('activity_events').insert({
        type: 'webhook.charge_success',
        payload: { reference: data.reference, amount: data.amount },
      })
    }

    if (event === 'charge.refund' && data.reference) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('id', data.metadata?.order_id || '')
        .maybeSingle()
      if (order) {
        await supabase.from('refunds').insert({
          order_id: order.id,
          amount: data.amount,
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
    console.error('Webhook error:', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
