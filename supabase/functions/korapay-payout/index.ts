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
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

        // Get user from auth header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
        if (userError || !user) {
            throw new Error('Invalid token or user')
        }

        const { amount, role } = await req.json()
        if (!amount || amount <= 0 || !role) {
            throw new Error('Invalid parameters')
        }

        // Get user profile for momo number and provider
        const { data: profile, error: profileErr } = await supabaseAdmin
            .from('profiles')
            .select('momo_number, momo_provider')
            .eq('user_id', user.id)
            .single()

        if (profileErr || !profile || !profile.momo_number) {
            throw new Error("Add Momo payment details in settings first.")
        }

        const secretKey = Deno.env.get("KORAPAY_SECRET_KEY")
        if (!secretKey) throw new Error("Payment gateway not configured")

        // Call Korapay Disbursement
        const reference = `wth_${Date.now()}_${user.id.substring(0, 5)}`
        let operator = "mtn"
        if (profile.momo_provider) {
            if (profile.momo_provider.toLowerCase().includes("voda") || profile.momo_provider.toLowerCase().includes("telecel")) operator = "vodafone"
            else if (profile.momo_provider.toLowerCase().includes("tigo") || profile.momo_provider.toLowerCase().includes("airtel")) operator = "airteltigo"
        }

        const payoutPayload = {
            reference,
            amount: amount,
            currency: "GHS",
            fee_bearer: "customer",
            destination: {
                type: "mobile_money",
                amount: amount,
                currency: "GHS",
                customer: {
                    email: user.email,
                    mobile_money: {
                        number: profile.momo_number,
                        operator: operator
                    }
                }
            }
        };

        const korapayRes = await fetch("https://api.korapay.com/merchant/api/v1/transactions/disburse", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secretKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payoutPayload)
        })

        const korapayData = await korapayRes.json()
        console.log("Korapay response payload:", korapayData);

        // Some success states from Korapay might return HTTP 200 with status: true/false.
        if (!korapayRes.ok || (korapayData.status !== true && korapayData.status !== 'success')) {
            console.error("Korapay disbursement failed:", korapayData);
            throw new Error(`Payout failed: ${korapayData.message || "Unknown error from Korapay"}`);
        }

        const transactionStatus = korapayData.data?.status || "processing"

        // If successful, log the transaction in database.
        if (role === 'affiliate') {
            await supabaseAdmin.from('withdrawals').insert({
                affiliate_id: user.id,
                amount: amount,
                status: transactionStatus === 'processing' ? 'pending' : 'completed',
                method: 'momo',
                provider: profile.momo_provider,
                account_number: profile.momo_number
            });
        } else {
            await supabaseAdmin.from('seller_payouts').insert({
                seller_id: user.id,
                amount: amount,
                status: transactionStatus === 'processing' ? 'pending' : 'completed',
            });
        }

        return new Response(JSON.stringify({ success: true, reference }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('Payout edge function error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
