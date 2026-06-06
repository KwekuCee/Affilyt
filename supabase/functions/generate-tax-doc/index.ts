import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const auth = req.headers.get('Authorization')
    if (!auth) throw new Error('Unauthorized')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { data: { user } } = await supabase.auth.getUser(auth.replace('Bearer ', ''))
    if (!user) throw new Error('Unauthorized')

    const { year } = await req.json()
    const yr = Number(year) || new Date().getFullYear()

    const { data: commissions } = await supabase
      .from('commissions')
      .select('amount, created_at')
      .eq('affiliate_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', `${yr}-01-01`)
      .lt('created_at', `${yr + 1}-01-01`)

    const gross = (commissions || []).reduce((s: number, c: any) => s + Number(c.amount), 0)
    const fees = gross * 0.1
    const net = gross - fees

    const monthly = Array.from({ length: 12 }, (_, m) => ({ month: m + 1, amount: 0 }))
    ;(commissions || []).forEach((c: any) => {
      monthly[new Date(c.created_at).getMonth()].amount += Number(c.amount)
    })

    const { data: ordCount } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', user.id)
      .gte('created_at', `${yr}-01-01`)
      .lt('created_at', `${yr + 1}-01-01`)

    const { data: doc, error } = await supabase
      .from('tax_documents')
      .upsert({
        user_id: user.id,
        tax_year: yr,
        gross_earnings: gross,
        total_fees: fees,
        net_earnings: net,
        total_orders: (ordCount as any)?.length || 0,
        monthly_breakdown: monthly,
      }, { onConflict: 'user_id,tax_year' })
      .select()
      .single()
    if (error) throw error

    return new Response(JSON.stringify({ document: doc }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
