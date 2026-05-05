import { useState, useMemo } from "react";
import { CalendarDays, TrendingUp, DollarSign, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    subDays, format, startOfWeek, getDay, differenceInWeeks, addWeeks,
    startOfDay, isSameDay
} from "date-fns";

// Generate mock earnings data for the past year
const generateMockData = () => {
    const data: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = subDays(today, i);
        const key = format(date, "yyyy-MM-dd");
        // Simulate realistic earnings with some zero days and occasional spikes
        const rand = Math.random();
        if (rand > 0.4) {
            const base = Math.random() * 50;
            const spike = Math.random() > 0.9 ? Math.random() * 200 : 0;
            data[key] = Math.round((base + spike) * 100) / 100;
        }
    }
    return data;
};

const EarningsCalendar = () => {
    const [hoveredDay, setHoveredDay] = useState<{ date: string; amount: number; x: number; y: number } | null>(null);

    const earningsData = useMemo(() => generateMockData(), []);

    const today = new Date();
    const yearAgo = subDays(today, 364);
    const weekStart = startOfWeek(yearAgo, { weekStartsOn: 0 });
    const totalWeeks = differenceInWeeks(today, weekStart) + 1;

    // Build the grid: columns = weeks, rows = days of week
    const weeks = useMemo(() => {
        const result: { date: Date; amount: number }[][] = [];
        for (let w = 0; w < totalWeeks; w++) {
            const week: { date: Date; amount: number }[] = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(addWeeks(weekStart, w));
                date.setDate(date.getDate() + d);
                const key = format(date, "yyyy-MM-dd");
                week.push({ date, amount: earningsData[key] || 0 });
            }
            result.push(week);
        }
        return result;
    }, [earningsData, totalWeeks, weekStart]);

    const maxEarnings = Math.max(...Object.values(earningsData), 1);

    const getColor = (amount: number) => {
        if (amount === 0) return "bg-secondary/60";
        const ratio = amount / maxEarnings;
        if (ratio < 0.25) return "bg-primary/20";
        if (ratio < 0.5) return "bg-primary/40";
        if (ratio < 0.75) return "bg-primary/60";
        return "bg-primary";
    };

    const totalEarnings = Object.values(earningsData).reduce((s, v) => s + v, 0);
    const activeDays = Object.values(earningsData).filter(v => v > 0).length;
    const bestDay = Object.entries(earningsData).sort((a, b) => b[1] - a[1])[0];
    const currentStreak = (() => {
        let streak = 0;
        for (let i = 0; i < 365; i++) {
            const key = format(subDays(today, i), "yyyy-MM-dd");
            if (earningsData[key] && earningsData[key] > 0) streak++;
            else break;
        }
        return streak;
    })();

    const monthLabels = useMemo(() => {
        const labels: { label: string; weekIndex: number }[] = [];
        let lastMonth = -1;
        for (let w = 0; w < totalWeeks; w++) {
            const date = new Date(addWeeks(weekStart, w));
            date.setDate(date.getDate() + 3);
            const month = date.getMonth();
            if (month !== lastMonth) {
                labels.push({ label: format(date, "MMM"), weekIndex: w });
                lastMonth = month;
            }
        }
        return labels;
    }, [totalWeeks, weekStart]);

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Earnings Calendar</h2>
                    <p className="text-muted-foreground font-medium">Your daily earnings heatmap over the past year.</p>
                </div>
                <CalendarDays className="h-10 w-10 text-primary" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Earned", value: `$${totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: "text-primary" },
                    { label: "Active Days", value: activeDays.toString(), icon: CalendarDays, color: "text-primary" },
                    { label: "Current Streak", value: `${currentStreak} days`, icon: Flame, color: "text-amber-500" },
                    { label: "Best Day", value: bestDay ? `$${bestDay[1].toFixed(0)}` : "$0", icon: TrendingUp, color: "text-primary" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border-2 border-border">
                        <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Heatmap */}
            <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-border shadow-2xl relative">
                {hoveredDay && (
                    <div
                        className="fixed z-50 px-4 py-3 rounded-xl bg-popover border border-border shadow-xl pointer-events-none"
                        style={{ left: hoveredDay.x + 12, top: hoveredDay.y - 60 }}
                    >
                        <p className="text-xs font-black text-foreground">${hoveredDay.amount.toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{hoveredDay.date}</p>
                    </div>
                )}

                {/* Month Labels */}
                <div className="flex mb-2 ml-10">
                    {monthLabels.map((m, i) => (
                        <div key={i} className="text-[10px] font-black text-muted-foreground uppercase tracking-wider" style={{ position: "relative", left: `${m.weekIndex * 16}px`, width: 0 }}>
                            {m.label}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex gap-0 overflow-x-auto scrollbar-hide pb-4">
                    {/* Day Labels */}
                    <div className="flex flex-col gap-[3px] mr-2 pt-0">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                            <div key={d} className="h-[13px] text-[8px] font-black text-muted-foreground flex items-center justify-end pr-1" style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Cells */}
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                            {week.map((day, di) => {
                                const dateStr = format(day.date, "MMM d, yyyy");
                                const isToday = isSameDay(day.date, today);
                                const isFuture = day.date > today;
                                return (
                                    <div
                                        key={di}
                                        className={`h-[13px] w-[13px] rounded-[3px] transition-all duration-200 cursor-pointer ${isFuture ? "bg-transparent" : getColor(day.amount)
                                            } ${isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""} hover:scale-150 hover:z-10`}
                                        onMouseEnter={e => !isFuture && setHoveredDay({ date: dateStr, amount: day.amount, x: e.clientX, y: e.clientY })}
                                        onMouseLeave={() => setHoveredDay(null)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-6 justify-end">
                    <span className="text-[10px] font-bold text-muted-foreground">Less</span>
                    {["bg-secondary/60", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((c, i) => (
                        <div key={i} className={`h-[13px] w-[13px] rounded-[3px] ${c}`} />
                    ))}
                    <span className="text-[10px] font-bold text-muted-foreground">More</span>
                </div>
            </div>
        </div>
    );
};

export default EarningsCalendar;
