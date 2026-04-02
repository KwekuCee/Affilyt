import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  iconColor?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, iconColor }: StatsCardProps) => {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ${iconColor || ""}`}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
      {trend && <p className="mt-1.5 text-xs font-medium text-success">{trend}</p>}
    </div>
  );
};

export default StatsCard;
