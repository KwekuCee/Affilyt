import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amount: number | null;
  is_read: boolean;
  created_at: string;
}

const NotificationsBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data as any) || []);
  };

  useEffect(() => {
    if (!user) return;
    fetchItems();
    const channel = supabase
      .channel(`notif_${user.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, () => fetchItems())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unread = items.filter(i => !i.is_read).length;

  const markAllRead = async () => {
    if (!user || unread === 0) return;
    await supabase.from("notifications").update({ is_read: true })
      .eq("user_id", user.id).eq("is_read", false);
    fetchItems();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full ring-2 ring-background flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 glass">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No notifications yet</div>
          ) : items.map(n => (
            <div key={n.id} className={`p-3 border-b border-border/50 ${!n.is_read ? "bg-primary/5" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{n.title}</p>
                  {n.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!n.is_read && <span className="h-2 w-2 bg-primary rounded-full shrink-0 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
