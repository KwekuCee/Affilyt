import { useState, useMemo } from "react";
import { Target, TrendingUp, Flame, Trophy, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const GoalTracker = () => {
    const [goal, setGoal] = useState(1000);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("1000");

    const currentEarnings = 623.50;
    const daysInMonth = 30;
    const dayOfMonth = new Date().getDate();
    const daysRemaining = daysInMonth - dayOfMonth;

    const progress = goal > 0 ? Math.min((currentEarnings / goal) * 100, 100) : 0;
    const dailyPace = dayOfMonth > 0 ? currentEarnings / dayOfMonth : 0;
    const neededDaily = daysRemaining > 0 ? (goal - currentEarnings) / daysRemaining : 0;
    const projectedTotal = dailyPace * daysInMonth;

    const paceStatus = useMemo(() => {
        const ratio = projectedTotal / goal;
        if (ratio >= 1) return { label: "Ahead of pace!", color: "text-primary", bg: "bg-primary/10" };
        if (ratio >= 0.85) return { label: "On track", color: "text-amber-500", bg: "bg-amber-500/10" };
        return { label: "Behind pace", color: "text-destructive", bg: "bg-destructive/10" };
    }, [projectedTotal, goal]);

    const nudge = useMemo(() => {
        if (progress >= 100) return "🏆 GOAL CRUSHED! You've hit your target!";
        if (progress >= 75) return "🔥 You're 75% there — the finish line is in sight!";
        if (progress >= 50) return "💪 Halfway done! Every sale counts.";
        if (progress >= 25) return "📈 Great start! Stay consistent.";
        return "🚀 Every journey starts with a step. Share your link today!";
    }, [progress]);

    const handleSaveGoal = () => {
        const val = Number(editValue);
        if (val > 0 && val <= 1000000) { setGoal(val); setIsEditing(false); }
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Goal Tracker</h2>
                <p className="text-sm text-muted-foreground mt-1">Set your monthly target and track progress.</p>
            </div>

            {/* Main Goal Card */}
            <div className="p-5 sm:p-8 rounded-2xl glass-primary relative overflow-hidden">
                <div className="absolute -top-16 -right-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-6">
                    {/* Goal + Current */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider mb-1">Monthly Goal</p>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-muted-foreground">$</span>
                                    <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="h-10 w-32 rounded-xl bg-secondary border-none font-bold text-xl" autoFocus />
                                    <Button onClick={handleSaveGoal} size="sm" className="h-10 rounded-xl text-xs font-medium px-4">Save</Button>
                                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="h-10 rounded-xl text-xs">Cancel</Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground">${goal.toLocaleString()}</p>
                                    <Button onClick={() => { setEditValue(goal.toString()); setIsEditing(true); }} variant="ghost" size="sm" className="rounded-lg text-xs text-primary">Edit</Button>
                                </div>
                            )}
                        </div>
                        <div className="sm:text-right">
                            <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">Current</p>
                            <p className="text-3xl sm:text-4xl font-bold text-primary">${currentEarnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                        <div className="relative h-6 sm:h-8 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                            {[25, 50, 75].map(m => (
                                <div key={m} className="absolute top-0 h-full w-px bg-foreground/10" style={{ left: `${m}%` }} />
                            ))}
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="font-semibold"><span className="text-primary">{progress.toFixed(1)}%</span> complete</p>
                            <p className="text-muted-foreground">${Math.max(0, goal - currentEarnings).toLocaleString()} remaining</p>
                        </div>
                    </div>

                    {/* Nudge */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm font-medium text-foreground">{nudge}</p>
                    </div>
                </div>
            </div>

            {/* Pace Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Daily Pace</h3>
                        <Badge className={`${paceStatus.bg} ${paceStatus.color} border-none text-[9px] font-medium`}>{paceStatus.label}</Badge>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-secondary/30">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase">Avg/Day</p>
                            <p className="text-lg font-bold text-foreground">${dailyPace.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/30">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase">Needed/Day</p>
                            <p className="text-lg font-bold text-foreground">${neededDaily > 0 ? neededDaily.toFixed(2) : "0.00"}</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl glass space-y-3 text-center">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary text-left">Projection</h3>
                    <Sparkles className="h-6 w-6 text-primary mx-auto" />
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Month-End</p>
                    <p className={`text-3xl font-bold ${projectedTotal >= goal ? "text-primary" : "text-foreground"}`}>${projectedTotal.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{projectedTotal >= goal ? "You'll hit your goal! 🎯" : `$${(goal - projectedTotal).toFixed(0)} short`}</p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl glass space-y-3 text-center">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary text-left">Time Left</h3>
                    <Zap className="h-6 w-6 text-amber-500 mx-auto" />
                    <p className="text-4xl font-bold text-foreground">{daysRemaining}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Days Remaining</p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(dayOfMonth / daysInMonth) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Day {dayOfMonth} of {daysInMonth}</p>
                </div>
            </div>
        </div>
    );
};

export default GoalTracker;
