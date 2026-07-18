import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { upsertOrderFromCharge } from '../korapay-verify/index.ts'

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
