import { useState, useMemo } from "react";
import { CalendarDays, TrendingUp, DollarSign, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    subDays, format, startOfWeek, getDay, differenceInWeeks, addWeeks,
    addDays
} from "date-fns";

// Generate 365 days of mock earnings
const generateDailyEarnings = () => {
    const today = new Date();
    const data: Record<string, number> = {};
    for (let i = 364; i >= 0; i--) {
        const date = subDays(today, i);
        const dStr = format(date, "yyyy-MM-dd");
        const dayOfWeek = getDay(date);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const rand = Math.random();
        if (rand < 0.25) data[dStr] = 0;
        else if (rand < 0.5) data[dStr] = Math.round(Math.random() * 20 + 1);
        else if (rand < 0.8) data[dStr] = Math.round(Math.random() * 60 + 20);
        else data[dStr] = Math.round(Math.random() * 150 + 60);
        if (isWeekend) data[dStr] = Math.round(data[dStr] * 0.4);
    }
    return data;
};

const getColor = (amount: number): string => {
    if (amount === 0) return "bg-secondary";
    if (amount < 15) return "bg-primary/20";
    if (amount < 40) return "bg-primary/40";
    if (amount < 80) return "bg-primary/60";
    return "bg-primary";
};

const EarningsCalendar = () => {
    const earnings = useMemo(generateDailyEarnings, []);
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    const today = new Date();
    const yearAgo = subDays(today, 364);

    // Build grid — weeks as columns, days as rows (Mon–Sun)
    const weekStart = startOfWeek(yearAgo, { weekStartsOn: 1 });
    const totalWeeks = differenceInWeeks(today, weekStart) + 1;

    const weeks = useMemo(() => {
        const w: { date: Date; dateStr: string; amount: number }[][] = [];
        for (let week = 0; week < totalWeeks; week++) {
            const weekDays: { date: Date; dateStr: string; amount: number }[] = [];
            for (let day = 0; day < 7; day++) {
                const d = addDays(addWeeks(weekStart, week), day);
                const dStr = format(d, "yyyy-MM-dd");
                weekDays.push({ date: d, dateStr: dStr, amount: earnings[dStr] || 0 });
            }
            w.push(weekDays);
        }
        return w;
    }, [earnings, totalWeeks, weekStart]);

    // Stats
    const totalEarnings = Object.values(earnings).reduce((a, b) => a + b, 0);
    const activeDays = Object.values(earnings).filter(v => v > 0).length;
    const bestDay = Object.entries(earnings).sort((a, b) => b[1] - a[1])[0];

    // Streak
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = format(subDays(today, i), "yyyy-MM-dd");
        if ((earnings[d] || 0) > 0) streak++;
        else break;
    }

    const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Earnings Calendar</h2>
                <p className="text-sm text-muted-foreground mt-1">Daily earnings heatmap for the past 12 months.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Earned", value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign },
                    { label: "Active Days", value: activeDays.toString(), icon: CalendarDays },
                    { label: "Current Streak", value: `${streak}d`, icon: Flame },
                    { label: "Best Day", value: bestDay ? `$${bestDay[1]}` : "$0", icon: TrendingUp },
                ].map((s, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl glass">
                        <div className="flex items-center gap-2 mb-2">
                            <s.icon className="h-4 w-4 text-primary" />
                            <p className="text-[11px] font-medium uppercase text-muted-foreground tracking-wider">{s.label}</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Heatmap */}
            <div className="p-4 sm:p-6 rounded-2xl glass overflow-x-auto">
                <div className="flex gap-1 min-w-[700px]">
                    <div className="flex flex-col gap-1 pr-2 pt-5">
                        {dayLabels.map((d, i) => (
                            <div key={i} className="h-3 flex items-center">
                                <span className="text-[9px] text-muted-foreground font-medium w-6">{d}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-[3px] flex-1 relative">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {wi === 0 && (
                                    <div className="h-4" />
                                )}
                                {wi !== 0 && week[0] && getDay(week[0].date) === 1 && format(week[0].date, "d") <= "7" && (
                                    <div className="h-4">
                                        <span className="text-[9px] text-muted-foreground font-medium">{format(week[0].date, "MMM")}</span>
                                    </div>
                                )}
                                {wi !== 0 && !(week[0] && getDay(week[0].date) === 1 && format(week[0].date, "d") <= "7") && (
                                    <div className="h-4" />
                                )}
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className={`h-3 w-3 rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/40 ${day.date > today ? "opacity-0" : getColor(day.amount)
                                            }`}
                                        onMouseEnter={() => setHoveredDay(day.dateStr)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground font-medium">Less</span>
                    {["bg-secondary", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((c, i) => (
                        <div key={i} className={`h-3 w-3 rounded-[2px] ${c}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground font-medium">More</span>
                </div>

                {/* Tooltip */}
                {hoveredDay && earnings[hoveredDay] !== undefined && (
                    <div className="mt-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{format(new Date(hoveredDay), "MMM d, yyyy")}</span>
                        {" — "}
                        <span className="font-semibold text-primary">${earnings[hoveredDay]}</span> earned
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarningsCalendar;
