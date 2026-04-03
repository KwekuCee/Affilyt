import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDown?: boolean;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendDown, subtitle }: StatsCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-black text-foreground tracking-tight">{value}</p>
      {trend && (
        <p className={`mt-1 text-xs font-medium ${trendDown ? "text-destructive" : "text-success"}`}>
          {trend}
        </p>
      )}
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
