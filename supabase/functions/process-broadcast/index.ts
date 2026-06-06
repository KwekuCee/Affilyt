import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Queue-only processor: marks queued broadcasts as "sent" and fans out
// to in-app notifications for the targeted audience. Email delivery
// can be wired later by replacing the inner loop with a Resend call.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: queued } = await supabase
      .from('broadcasts')
      .select('*')
      .eq('status', 'queued')
      .limit(10)

    let processed = 0
    for (const b of queued || []) {
      let userQuery = supabase.from('user_roles').select('user_id')
      if (b.audience && b.audience !== 'all') {
        userQuery = userQuery.eq('role', b.audience)
      }
      const { data: users } = await userQuery
      const rows = (users || []).map((u: any) => ({
        user_id: u.user_id,
        type: 'broadcast',
        title: b.title,
        description: b.body,
      }))
      if (rows.length) await supabase.from('notifications').insert(rows)

      await supabase
        .from('broadcasts')
        .update({ status: 'sent', sent_at: new Date().toISOString(), recipients_count: rows.length })
        .eq('id', b.id)
      processed++
    }

    return new Response(JSON.stringify({ processed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
