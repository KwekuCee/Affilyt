import { useEffect, useState } from "react";
import { Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const WithdrawalBalanceCard = () => {
  const { user } = useAuth();
  const [earned, setEarned] = useState(0);
  const [pending, setPending] = useState(0);
  const [minPayout, setMinPayout] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase.from("commissions").select("amount,status").eq("affiliate_id", user.id);
      const completed = (c || []).filter((x: any) => x.status === "completed").reduce((s: number, x: any) => s + Number(x.amount), 0);
      const { data: w } = await supabase.from("withdrawals").select("amount,status").eq("affiliate_id", user.id);
      const requested = (w || []).filter((x: any) => ["pending", "processing", "completed"].includes(x.status)).reduce((s: number, x: any) => s + Number(x.amount), 0);
      setEarned(completed);
      setPending(requested);

      const { data: ws } = await supabase.from("withdrawal_settings").select("min_payout_amount").eq("user_id", user.id).maybeSingle();
      if (ws?.min_payout_amount) setMinPayout(Number(ws.min_payout_amount));
    })();
  }, [user]);

  const available = Math.max(0, earned - pending);
  const canWithdraw = available >= minPayout;

  const requestWithdrawal = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("korapay-payout", {
      body: { amount: available, role: "affiliate" },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Payout requested", { description: `Ref: ${data?.reference || "pending"}` });
  };

  return (
    <Card className="p-6 glass-subtle border-primary/20">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
        <Wallet className="w-3 h-3" /> Available Balance
      </div>
      <div className="text-4xl font-black italic">${available.toFixed(2)}</div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Min payout: ${minPayout.toFixed(2)} · Pending: ${pending.toFixed(2)}
      </div>
      <Button
        disabled={!canWithdraw || loading}
        onClick={requestWithdrawal}
        className="w-full mt-4 h-12 rounded-2xl font-black uppercase tracking-widest gap-2"
      >
        {loading ? "Processing..." : <>Withdraw <ArrowUpRight className="w-4 h-4" /></>}
      </Button>
      {!canWithdraw && (
        <div className="mt-2 text-[10px] text-muted-foreground text-center">
          ${(minPayout - available).toFixed(2)} until threshold
        </div>
      )}
    </Card>
  );
};

export default WithdrawalBalanceCard;
