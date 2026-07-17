import { useEffect, useMemo, useState } from "react";
import { Bell, DollarSign, CreditCard, Trophy, Check, CheckCheck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface DbNotification {
  id: string; type: string; title: string; description: string | null;
  amount: number | null; is_read: boolean; created_at: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  sale: { icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  payout: { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
  contest: { icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
  goal: { icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
  other: { icon: Bell, color: "text-muted-foreground", bg: "bg-secondary" },
};

const NotificationsCenter = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<DbNotification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase.channel(`nc_${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const filtered = useMemo(() => filter === "all" ? items : items.filter(n => n.type === filter), [items, filter]);
  const unread = items.filter(n => !n.is_read).length;

  const markRead = async (id: string) => { await supabase.from("notifications").update({ is_read: true }).eq("id", id); load(); };
  const markAll = async () => { if (!user) return; await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false); load(); };
  const dismiss = async (id: string) => { await supabase.from("notifications").delete().eq("id", id); load(); };

  const filters = [
    { key: "all", label: "All", icon: Bell },
    { key: "sale", label: "Sales", icon: DollarSign },
    { key: "payout", label: "Payouts", icon: CreditCard },
    { key: "contest", label: "Contests", icon: Trophy },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-primary" />
            {unread > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">{unread}</span>}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Notifications</h2>
            <p className="text-sm text-muted-foreground">Alerts about sales, payouts, and contests. Also emailed to you.</p>
          </div>
        </div>
        {unread > 0 && (
          <Button onClick={markAll} variant="outline" className="rounded-xl font-medium text-xs h-9 px-4">
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(f => {
          const count = f.key === "all" ? items.length : items.filter(n => n.type === f.key).length;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${filter === f.key ? "bg-primary text-primary-foreground" : "glass-subtle"}`}>
              <f.icon className="h-3.5 w-3.5" /> {f.label} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="p-12 rounded-2xl glass text-center text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        ) : filtered.map(n => {
          const config = typeConfig[n.type] || typeConfig.other;
          const Icon = config.icon;
          return (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} className={`group p-4 sm:p-5 rounded-2xl transition-all cursor-pointer relative ${n.is_read ? "glass-subtle opacity-70 hover:opacity-100" : "glass-primary shadow-md hover:shadow-lg"}`}>
              {!n.is_read && <div className="absolute top-0 left-0 h-full w-1 bg-primary rounded-l-2xl" />}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>
                    {!n.is_read && <Badge className="bg-primary/20 text-primary border-none text-[8px] font-medium px-1.5 py-0 rounded-full">NEW</Badge>}
                  </div>
                  {n.description && <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                    {n.amount != null && <Badge className={`${config.bg} ${config.color} border-none text-[10px] font-medium`}>${Number(n.amount).toFixed(2)}</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!n.is_read && (
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={e => { e.stopPropagation(); markRead(n.id); }}><Check className="h-3.5 w-3.5" /></Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-destructive/10" onClick={e => { e.stopPropagation(); dismiss(n.id); }}><X className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsCenter;
