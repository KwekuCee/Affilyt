import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const EarningsProjection = () => {
  const { user } = useAuth();
  const [last30, setLast30] = useState(0);
  const [projection, setProjection] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const { data } = await supabase
        .from("commissions")
        .select("amount,created_at")
        .eq("affiliate_id", user.id)
        .gte("created_at", since.toISOString());
      const total = (data || []).reduce((s: number, c: any) => s + Number(c.amount), 0);
      setLast30(total);
      setProjection(total * 12); // 30-day run-rate annualized
    })();
  }, [user]);

  return (
    <Card className="p-6 glass-subtle">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
        <TrendingUp className="w-3 h-3" /> 12-Month Projection
      </div>
      <div className="text-4xl font-black italic">${projection.toFixed(0)}</div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Based on last 30 days · ${last30.toFixed(2)}
      </div>
    </Card>
  );
};

export default EarningsProjection;
