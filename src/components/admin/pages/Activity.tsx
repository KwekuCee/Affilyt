import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Activity as ActivityIcon, UserPlus, ShoppingCart, Wallet, AlertTriangle, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const iconFor = (type: string) => {
  if (type.includes("signup")) return UserPlus;
  if (type.includes("order") || type.includes("sale")) return ShoppingCart;
  if (type.includes("payout") || type.includes("withdraw")) return Wallet;
  if (type.includes("fraud") || type.includes("alert")) return AlertTriangle;
  if (type.includes("product")) return Package;
  return ActivityIcon;
};

const ActivityFeed = () => {
  const [events, setEvents] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("activity_events").select("*").order("created_at", { ascending: false }).limit(100);
    setEvents(data || []);
  };

  useEffect(() => {
    load();
    const channel = supabase.channel("activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_events" }, (payload) => {
        setEvents((prev) => [payload.new, ...prev].slice(0, 100));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div>
      <PageHeader title="Activity Feed" description="Real-time platform activity. Updates live." />
      <div className="rounded-lg border border-border glass-subtle divide-y divide-border">
        {events.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">No activity yet.</div>}
        {events.map((e) => {
          const Icon = iconFor(e.type);
          return (
            <div key={e.id} className="flex items-start gap-3 p-4 hover:bg-muted/30">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{e.message}</p>
                {e.actor_label && <p className="text-xs text-muted-foreground">by {e.actor_label}</p>}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
