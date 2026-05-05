import { useState, useMemo } from "react";
import { Target, TrendingUp, Flame, Trophy, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const GoalTracker = () => {
    const [goal, setGoal] = useState(1000);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("1000");

    // Simulated current earnings this month
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
        if (ratio >= 1) return { label: "Ahead of pace!", color: "text-primary", bg: "bg-primary/10", icon: TrendingUp };
        if (ratio >= 0.85) return { label: "On track", color: "text-amber-500", bg: "bg-amber-500/10", icon: Target };
        return { label: "Behind pace", color: "text-destructive", bg: "bg-destructive/10", icon: Flame };
    }, [projectedTotal, goal]);

    const nudge = useMemo(() => {
        if (progress >= 100) return { text: "🏆 GOAL CRUSHED! You've hit your target!", emoji: "🎉" };
        if (progress >= 75) return { text: "You're 75% there — the finish line is in sight! Keep the momentum!", emoji: "🔥" };
        if (progress >= 50) return { text: "Halfway done! Every sale counts. You've got this!", emoji: "💪" };
        if (progress >= 25) return { text: "Great start! Stay consistent and watch it compound.", emoji: "📈" };
        return { text: "Every journey starts with a step. Share your link today!", emoji: "🚀" };
    }, [progress]);

    const milestones = [25, 50, 75, 100];

    const handleSaveGoal = () => {
        const val = Number(editValue);
        if (val > 0 && val <= 1000000) {
            setGoal(val);
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Goal Tracker</h2>
                    <p className="text-muted-foreground font-medium">Set your monthly target and crush it.</p>
                </div>
                <Target className="h-10 w-10 text-primary" />
            </div>

            {/* Main Goal Card */}
            <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 h-60 w-60 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-8">
                    {/* Goal Setting */}
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Trophy className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Goal</p>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-2xl font-black text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            className="h-12 w-40 rounded-xl bg-secondary border-none font-black text-2xl"
                                            autoFocus
                                        />
                                        <Button onClick={handleSaveGoal} className="h-12 rounded-xl font-black text-xs uppercase px-6">
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="h-12 rounded-xl font-black text-xs uppercase">
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <p className="text-4xl font-black text-foreground italic">${goal.toLocaleString()}</p>
                                        <Button onClick={() => { setEditValue(goal.toString()); setIsEditing(true); }} variant="ghost" className="rounded-xl text-xs font-black text-primary uppercase h-8 px-3">
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current</p>
                            <p className="text-4xl font-black text-primary italic">${currentEarnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-4">
                        <div className="relative h-10 w-full bg-secondary/50 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>

                            {/* Milestone Markers */}
                            {milestones.map(m => (
                                <div
                                    key={m}
                                    className="absolute top-0 h-full w-0.5 bg-foreground/10"
                                    style={{ left: `${m}%` }}
                                >
                                    <span
                                        className={`absolute -top-6 -translate-x-1/2 text-[9px] font-black ${progress >= m ? "text-primary" : "text-muted-foreground"}`}
                                    >
                                        {m}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <p className="text-sm font-black text-foreground">
                                <span className="text-primary">{progress.toFixed(1)}%</span> complete
                            </p>
                            <p className="text-sm font-bold text-muted-foreground">
                                ${Math.max(0, goal - currentEarnings).toLocaleString()} remaining
                            </p>
                        </div>
                    </div>

                    {/* Motivational Nudge */}
                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                        <p className="text-lg font-black text-foreground">
                            <span className="mr-2">{nudge.emoji}</span>
                            {nudge.text}
                        </p>
                    </div>
                </div>
            </div>

            {/* Pace Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Daily Pace */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Daily Pace</h3>
                        <Badge className={`${paceStatus.bg} ${paceStatus.color} border-none text-[9px] font-black uppercase px-3 py-1 rounded-full`}>
                            {paceStatus.label}
                        </Badge>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-secondary/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Avg. Per Day</p>
                            <p className="text-2xl font-black text-foreground">${dailyPace.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Needed Per Day</p>
                            <p className="text-2xl font-black text-foreground">${neededDaily > 0 ? neededDaily.toFixed(2) : "0.00"}</p>
                        </div>
                    </div>
                </div>

                {/* Projection */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Projection</h3>
                    <div className="text-center py-4">
                        <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Projected Month-End</p>
                        <p className={`text-4xl font-black italic ${projectedTotal >= goal ? "text-primary" : "text-foreground"}`}>
                            ${projectedTotal.toFixed(0)}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground mt-2">
                            {projectedTotal >= goal ? "You'll hit your goal! 🎯" : `$${(goal - projectedTotal).toFixed(0)} short of goal`}
                        </p>
                    </div>
                </div>

                {/* Time Remaining */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Time Left</h3>
                    <div className="text-center py-4">
                        <Zap className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-6xl font-black text-foreground italic">{daysRemaining}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Days Remaining</p>
                        <div className="mt-4 h-2 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${(dayOfMonth / daysInMonth) * 100}%` }}
                            />
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground mt-2">Day {dayOfMonth} of {daysInMonth}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalTracker;
