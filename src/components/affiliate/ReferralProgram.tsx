import { useEffect, useState } from "react";
import { UserPlus, Copy, Check, Gift, Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const tiers = [
  { min: 0, max: 4, label: "Bronze", bonus: 5, color: "text-amber-700", bg: "bg-amber-700/10" },
  { min: 5, max: 14, label: "Silver", bonus: 10, color: "text-slate-400", bg: "bg-slate-400/10" },
  { min: 15, max: 29, label: "Gold", bonus: 15, color: "text-amber-400", bg: "bg-amber-400/10" },
  { min: 30, max: Infinity, label: "Diamond", bonus: 25, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

interface Ref { id: string; referred_user_id: string | null; status: string; bonus_amount: number | null; created_at: string; email: string | null; name: string | null; earnings: number }

const ReferralProgram = () => {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [refs, setRefs] = useState<Ref[]>([]);

  const referralCode = profile?.affiliate_link || user?.id?.slice(0, 8) || "";
  const inviteLink = `${window.location.origin}/become-affiliate?ref=${referralCode}`;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("referrals").select("*").eq("referrer_id", user.id).order("created_at", { ascending: false });
      const list: Ref[] = [];
      for (const r of (data || []) as any[]) {
        let name: string | null = null; let email: string | null = null; let earnings = 0;
        if (r.referred_user_id) {
          const { data: p } = await supabase.from("profiles").select("full_name, email").eq("user_id", r.referred_user_id).maybeSingle();
          name = (p as any)?.full_name || null; email = (p as any)?.email || null;
          const { data: c } = await supabase.from("commissions").select("amount").eq("affiliate_id", r.referred_user_id);
          earnings = (c || []).reduce((s: number, x: any) => s + Number(x.amount), 0);
        }
        list.push({ id: r.id, referred_user_id: r.referred_user_id, status: r.status || "pending", bonus_amount: r.bonus_amount, created_at: r.created_at, email, name, earnings });
      }
      setRefs(list);
    })();
  }, [user]);

  const activeCount = refs.filter(r => r.status === "active" || r.status === "completed").length;
  const currentTier = tiers.find(t => activeCount >= t.min && activeCount <= t.max) || tiers[0];
  const nextTier = tiers.find(t => t.min > activeCount);
  const totalBonus = refs.reduce((s, r) => s + Number(r.bonus_amount || 0), 0);
  const networkEarnings = refs.reduce((s, r) => s + r.earnings, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Referral Program</h2>
        <p className="text-sm text-muted-foreground mt-1">Invite affiliates and earn tier-based bonuses on their activity.</p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
        <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /><h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Your Invite Link</h3></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={inviteLink} readOnly className="h-10 rounded-xl glass border-none font-mono text-xs flex-1 text-foreground" />
          <Button onClick={handleCopy} className="h-10 rounded-xl font-semibold text-sm px-6">
            {copied ? <><Check className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Link</>}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Code: <span className="font-mono font-semibold text-foreground">{referralCode}</span></p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Referrals", value: activeCount.toString(), icon: Users, extra: `${refs.length - activeCount} pending` },
          { label: "Current Tier", value: currentTier.label, icon: Gift, extra: `$${currentTier.bonus}/referral` },
          { label: "Total Bonus", value: `$${totalBonus.toFixed(2)}`, icon: DollarSign, extra: "Earned to date" },
          { label: "Network Revenue", value: `$${networkEarnings.toFixed(2)}`, icon: TrendingUp, extra: "From your referrals" },
        ].map((s, i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl glass">
            <div className="flex items-center gap-2 mb-2"><s.icon className="h-4 w-4 text-primary" /><p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">{s.label}</p></div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.extra}</p>
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Bonus Tiers</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map(t => {
            const isActive = t.label === currentTier.label;
            return (
              <div key={t.label} className={`p-4 rounded-xl border text-center ${isActive ? `${t.bg} border-primary/20` : "bg-secondary/30 border-transparent"}`}>
                <p className={`font-bold text-sm ${isActive ? t.color : "text-muted-foreground"}`}>{t.label}</p>
                <p className="text-lg font-bold text-foreground">${t.bonus}</p>
                <p className="text-[9px] text-muted-foreground uppercase">per referral</p>
                <p className="text-[9px] text-muted-foreground mt-1">{t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`} referrals</p>
                {isActive && <Badge className="mt-1.5 text-[8px] bg-primary text-primary-foreground">CURRENT</Badge>}
              </div>
            );
          })}
        </div>
        {nextTier && <p className="text-xs text-muted-foreground">Invite <span className="font-semibold text-primary">{nextTier.min - activeCount}</span> more to reach <span className="font-semibold text-foreground">{nextTier.label}</span> (${nextTier.bonus}/referral)</p>}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Your Referrals</h3>
        {refs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No referrals yet. Share your invite link to earn bonuses.</p>
        ) : (
          <div className="space-y-2">
            {refs.map(ref => (
              <div key={ref.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-border transition-all">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm text-primary shrink-0">{(ref.name || ref.email || "?").charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{ref.name || ref.email || "Pending signup"}</p>
                    <Badge variant={ref.status === "active" || ref.status === "completed" ? "default" : "secondary"} className="text-[9px]">{ref.status}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  {ref.status === "active" || ref.status === "completed" ? (
                    <><p className="text-sm font-bold text-foreground">${ref.earnings.toFixed(2)}</p><p className="text-[9px] text-muted-foreground">earned</p></>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> Pending</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralProgram;
