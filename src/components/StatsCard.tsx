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
  <div className="rounded-lg border border-border bg-card p-5 hover:shadow-elevated transition-all">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
    <p className="font-display text-2xl font-bold tabular">{value}</p>
    {trend && <p className={`text-xs mt-1.5 ${trendDown ? "text-destructive" : "text-success"}`}>{trend}</p>}
    {subtitle && <p className="text-xs mt-1 text-muted-foreground">{subtitle}</p>}
  </div>
);

export default StatsCard;
