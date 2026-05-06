import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDown?: boolean;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendDown, subtitle }: Props) => (
  <div className="glass glass-hover rounded-2xl p-5 group cursor-default">
    <div className="flex items-start justify-between mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="h-9 w-9 rounded-xl bg-primary/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
    <p className="font-display text-2xl font-bold tabular tracking-tight">{value}</p>
    {trend && (
      <p className={`text-xs mt-1.5 font-medium ${trendDown ? "text-destructive" : "text-success"}`}>
        {trend}
      </p>
    )}
    {subtitle && <p className="text-xs mt-1 text-muted-foreground">{subtitle}</p>}
  </div>
);

export default StatsCard;
