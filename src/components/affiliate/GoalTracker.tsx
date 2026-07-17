import { useEffect, useMemo, useState } from "react";
import { Target, Sparkles, Zap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const GoalTracker = () => {
  const { user } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [goal, setGoal] = useState<{ id?: string; target_amount: number } | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOfMonth = now.getMonth() + 1 === month && now.getFullYear() === year ? now.getDate() : daysInMonth;
  const daysRemaining = Math.max(0, daysInMonth - dayOfMonth);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: g } = await supabase.from("affiliate_goals").select("*").eq("user_id", user.id).eq("month", month).eq("year", year).maybeSingle();
    setGoal(g ? { id: g.id, target_amount: Number(g.target_amount) } : null);

    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 1).toISOString();
    const { data: comm } = await supabase.from("commissions").select("amount").eq("affiliate_id", user.id).gte("created_at", start).lt("created_at", end);
    setEarnings((comm || []).reduce((s: number, c: any) => s + Number(c.amount), 0));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, month, year]);

  const target = goal?.target_amount || 0;
  const progress = target > 0 ? Math.min((earnings / target) * 100, 100) : 0;
  const dailyPace = dayOfMonth > 0 ? earnings / dayOfMonth : 0;
  const neededDaily = daysRemaining > 0 ? Math.max(0, target - earnings) / daysRemaining : 0;
  const projectedTotal = dailyPace * daysInMonth;

  const paceStatus = useMemo(() => {
    if (!target) return { label: "No target", color: "text-muted-foreground", bg: "bg-secondary" };
    const ratio = projectedTotal / target;
    if (ratio >= 1) return { label: "Ahead of pace!", color: "text-primary", bg: "bg-primary/10" };
    if (ratio >= 0.85) return { label: "On track", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Behind pace", color: "text-destructive", bg: "bg-destructive/10" };
  }, [projectedTotal, target]);

  const saveGoal = async () => {
    if (!user) return;
    const val = Number(editValue);
    if (!(val > 0 && val <= 1000000)) return toast.error("Enter a valid amount");
    if (goal?.id) {
      await supabase.from("affiliate_goals").update({ target_amount: val }).eq("id", goal.id);
    } else {
      await supabase.from("affiliate_goals").insert({ user_id: user.id, month, year, target_amount: val });
    }
    setEditing(false);
    toast.success("Goal saved");
    load();
  };

  const removeGoal = async () => {
    if (!goal?.id) return;
    await supabase.from("affiliate_goals").delete().eq("id", goal.id);
    toast.success("Goal removed");
    load();
  };

  const nudge = target === 0 ? "Set a monthly target to start tracking." :
    progress >= 100 ? "🏆 Goal crushed! You hit your target." :
    progress >= 75 ? "🔥 You're 75% there — finish strong!" :
    progress >= 50 ? "💪 Halfway done!" :
    progress >= 25 ? "📈 Great start. Stay consistent." :
    "🚀 Share your links to start earning.";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Goal Tracker</h2>
          <p className="text-sm text-muted-foreground mt-1">Set your monthly earnings target. Email reminders at 50% & 100%.</p>
        </div>
        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="h-10 rounded-xl bg-secondary border-none font-medium px-3 text-sm">
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="h-10 rounded-xl bg-secondary border-none font-medium px-3 text-sm">
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="p-5 sm:p-8 rounded-2xl glass-primary relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider mb-1">Monthly Goal</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-muted-foreground">$</span>
                  <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="h-10 w-32 rounded-xl bg-secondary border-none font-bold text-xl" autoFocus />
                  <Button onClick={saveGoal} size="sm" className="h-10 rounded-xl">Save</Button>
                  <Button onClick={() => setEditing(false)} variant="ghost" size="sm" className="h-10 rounded-xl">Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">${target.toLocaleString()}</p>
                  <Button onClick={() => { setEditValue(String(target || 1000)); setEditing(true); }} variant="ghost" size="sm" className="rounded-lg text-xs text-primary">
                    {target ? "Edit" : <><Plus className="h-3 w-3 mr-1" /> Set Goal</>}
                  </Button>
                  {goal?.id && <Button onClick={removeGoal} variant="ghost" size="sm" className="rounded-lg text-xs text-destructive"><Trash2 className="h-3 w-3" /></Button>}
                </div>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">Earned</p>
              <p className="text-3xl sm:text-4xl font-bold text-primary">${earnings.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative h-6 sm:h-8 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold"><span className="text-primary">{progress.toFixed(1)}%</span> complete</p>
              <p className="text-muted-foreground">${Math.max(0, target - earnings).toLocaleString()} remaining</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium text-foreground">{nudge}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Daily Pace</h3>
            <Badge className={`${paceStatus.bg} ${paceStatus.color} border-none text-[9px] font-medium`}>{paceStatus.label}</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-secondary/30"><p className="text-[10px] font-medium text-muted-foreground uppercase">Avg/Day</p><p className="text-lg font-bold text-foreground">${dailyPace.toFixed(2)}</p></div>
            <div className="p-3 rounded-xl bg-secondary/30"><p className="text-[10px] font-medium text-muted-foreground uppercase">Needed/Day</p><p className="text-lg font-bold text-foreground">${neededDaily.toFixed(2)}</p></div>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl glass space-y-3 text-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary text-left">Projection</h3>
          <Sparkles className="h-6 w-6 text-primary mx-auto" />
          <p className="text-[10px] font-medium text-muted-foreground uppercase">Month-End</p>
          <p className={`text-3xl font-bold ${projectedTotal >= target && target > 0 ? "text-primary" : "text-foreground"}`}>${projectedTotal.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">{target > 0 && projectedTotal >= target ? "You'll hit your goal! 🎯" : target > 0 ? `$${(target - projectedTotal).toFixed(0)} short` : "Set a goal to see projection"}</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl glass space-y-3 text-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary text-left">Time Left</h3>
          <Zap className="h-6 w-6 text-amber-500 mx-auto" />
          <p className="text-4xl font-bold text-foreground">{daysRemaining}</p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Days Remaining</p>
          <p className="text-[10px] text-muted-foreground">Day {dayOfMonth} of {daysInMonth}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
