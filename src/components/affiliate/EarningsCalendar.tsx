import { useEffect, useMemo, useState } from "react";
import { CalendarDays, TrendingUp, DollarSign, Flame } from "lucide-react";
import { subDays, format, startOfWeek, getDay, differenceInWeeks, addWeeks, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const getColor = (a: number) => a === 0 ? "bg-secondary" : a < 15 ? "bg-primary/20" : a < 40 ? "bg-primary/40" : a < 80 ? "bg-primary/60" : "bg-primary";

const EarningsCalendar = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const yearAgo = subDays(new Date(), 364).toISOString();
      const { data } = await supabase.from("commissions").select("amount, created_at").eq("affiliate_id", user.id).gte("created_at", yearAgo);
      const map: Record<string, number> = {};
      (data || []).forEach((c: any) => {
        const k = format(new Date(c.created_at), "yyyy-MM-dd");
        map[k] = (map[k] || 0) + Number(c.amount);
      });
      setEarnings(map);
      setLoading(false);
    })();
  }, [user]);

  const today = new Date();
  const yearAgo = subDays(today, 364);
  const weekStart = startOfWeek(yearAgo, { weekStartsOn: 1 });
  const totalWeeks = differenceInWeeks(today, weekStart) + 1;

  const weeks = useMemo(() => {
    const w: { date: Date; dateStr: string; amount: number }[][] = [];
    for (let week = 0; week < totalWeeks; week++) {
      const wd: { date: Date; dateStr: string; amount: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dd = addDays(addWeeks(weekStart, week), d);
        const s = format(dd, "yyyy-MM-dd");
        wd.push({ date: dd, dateStr: s, amount: earnings[s] || 0 });
      }
      w.push(wd);
    }
    return w;
  }, [earnings, totalWeeks, weekStart]);

  const total = Object.values(earnings).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(earnings).filter(v => v > 0).length;
  const best = Object.entries(earnings).sort((a, b) => b[1] - a[1])[0];
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    if ((earnings[d] || 0) > 0) streak++; else break;
  }

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Earnings Calendar</h2>
        <p className="text-sm text-muted-foreground mt-1">Real daily commissions heatmap for the past 12 months.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Earned", value: `$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: DollarSign },
          { label: "Active Days", value: activeDays.toString(), icon: CalendarDays },
          { label: "Current Streak", value: `${streak}d`, icon: Flame },
          { label: "Best Day", value: best ? `$${best[1].toFixed(2)}` : "$0", icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl glass">
            <div className="flex items-center gap-2 mb-2"><s.icon className="h-4 w-4 text-primary" /><p className="text-[11px] font-medium uppercase text-muted-foreground tracking-wider">{s.label}</p></div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-6 rounded-2xl glass overflow-x-auto">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
        ) : total === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No commissions yet. Once you earn, they'll appear here.</p>
        ) : (
          <div className="flex gap-1 min-w-[700px]">
            <div className="flex flex-col gap-1 pr-2 pt-5">
              {dayLabels.map((d, i) => <div key={i} className="h-3 flex items-center"><span className="text-[9px] text-muted-foreground w-6">{d}</span></div>)}
            </div>
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  <div className="h-4">{week[0] && getDay(week[0].date) === 1 && Number(format(week[0].date, "d")) <= 7 && <span className="text-[9px] text-muted-foreground">{format(week[0].date, "MMM")}</span>}</div>
                  {week.map((day, di) => (
                    <div key={di} className={`h-3 w-3 rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/40 ${day.date > today ? "opacity-0" : getColor(day.amount)}`}
                      onMouseEnter={() => setHovered(day.dateStr)} onMouseLeave={() => setHovered(null)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {["bg-secondary", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((c, i) => <div key={i} className={`h-3 w-3 rounded-[2px] ${c}`} />)}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>
        {hovered && (
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{format(new Date(hovered), "MMM d, yyyy")}</span> — <span className="font-semibold text-primary">${(earnings[hovered] || 0).toFixed(2)}</span> earned
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsCalendar;
