import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SalesHeatmap = () => {
  const { user } = useAuth();
  const [grid, setGrid] = useState<number[][]>(Array.from({ length: 7 }, () => Array(24).fill(0)));
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 90);
      const { data } = await supabase
        .from("orders")
        .select("created_at,amount")
        .eq("seller_id", user.id)
        .eq("status", "completed")
        .gte("created_at", since.toISOString());

      const g = Array.from({ length: 7 }, () => Array(24).fill(0));
      let m = 0;
      (data || []).forEach((o: any) => {
        const d = new Date(o.created_at);
        const v = (g[d.getDay()][d.getHours()] += Number(o.amount));
        if (v > m) m = v;
      });
      setGrid(g);
      setMax(m);
    })();
  }, [user]);

  return (
    <Card className="p-6 glass-subtle">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
        <Flame className="w-3 h-3" /> Sales Heatmap · Last 90 Days
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex gap-1 mb-1 pl-10">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="w-4 text-[8px] font-black text-muted-foreground text-center">{h % 6 === 0 ? h : ""}</div>
            ))}
          </div>
          {grid.map((row, d) => (
            <div key={d} className="flex gap-1 items-center mb-1">
              <div className="w-8 text-[10px] font-black text-muted-foreground">{DAYS[d]}</div>
              {row.map((v, h) => {
                const intensity = max > 0 ? v / max : 0;
                return (
                  <div
                    key={h}
                    className="w-4 h-4 rounded-sm"
                    style={{ background: `hsl(var(--primary) / ${0.08 + intensity * 0.92})` }}
                    title={`${DAYS[d]} ${h}:00 — $${v.toFixed(2)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SalesHeatmap;
