import { useState, useMemo } from "react";
import { Bell, DollarSign, CreditCard, Trophy, Check, CheckCheck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NotificationType = "sale" | "payout" | "contest";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
    amount?: number;
}

const generateNotifications = (): Notification[] => {
    const now = new Date();
    return [
        { id: "n1", type: "sale", title: "New Sale!", description: "Someone purchased Digital Marketing Mastery through your link.", timestamp: new Date(now.getTime() - 25 * 60 * 1000), read: false, amount: 29.10 },
        { id: "n2", type: "payout", title: "Payout Processed", description: "Your withdrawal of $150.00 has been sent to your MoMo account.", timestamp: new Date(now.getTime() - 2 * 3600000), read: false, amount: 150 },
        { id: "n3", type: "sale", title: "New Sale!", description: "E-Book Bundle Pack was purchased via your Instagram link.", timestamp: new Date(now.getTime() - 5 * 3600000), read: false, amount: 14.50 },
        { id: "n4", type: "contest", title: "New Contest Launched!", description: "\"Summer Sales Sprint\" is now live. Top seller wins $500 cash prize!", timestamp: new Date(now.getTime() - 8 * 3600000), read: true },
        { id: "n5", type: "sale", title: "New Sale!", description: "Premium Headphones sold. Commission: $29.85", timestamp: new Date(now.getTime() - 86400000), read: true, amount: 29.85 },
        { id: "n6", type: "payout", title: "Payout Confirmed", description: "Your $200.00 withdrawal was completed successfully.", timestamp: new Date(now.getTime() - 2 * 86400000), read: true, amount: 200 },
        { id: "n7", type: "sale", title: "New Sale!", description: "Online Cooking Academy sold via your WhatsApp share.", timestamp: new Date(now.getTime() - 3 * 86400000), read: true, amount: 20.65 },
        { id: "n8", type: "contest", title: "Contest Ending Soon", description: "\"March Madness Challenge\" ends in 2 days. You're currently #4!", timestamp: new Date(now.getTime() - 4 * 86400000), read: true },
    ];
};

const typeConfig: Record<NotificationType, { icon: any; color: string; bg: string }> = {
    sale: { icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    payout: { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
    contest: { icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const formatTimeAgo = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
};

const NotificationsCenter = () => {
    const [notifications, setNotifications] = useState(generateNotifications);
    const [filter, setFilter] = useState<NotificationType | "all">("all");

    const filtered = useMemo(() =>
        filter === "all" ? notifications : notifications.filter(n => n.type === filter),
        [notifications, filter]
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

    const filters: { key: NotificationType | "all"; label: string; icon: any }[] = [
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
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Notifications</h2>
                        <p className="text-sm text-muted-foreground">Sale alerts, payout updates, and contest news.</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllRead} variant="outline" className="rounded-xl font-medium text-xs h-9 px-4">
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark All Read
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {filters.map(f => {
                    const count = f.key === "all" ? notifications.length : notifications.filter(n => n.type === f.key).length;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${filter === f.key
                                ? "bg-primary text-primary-foreground"
                                : "glass-subtle text-foreground hover:border-primary/30"
                                }`}
                        >
                            <f.icon className="h-3.5 w-3.5" />
                            {f.label}
                            <span className="opacity-70">({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div className="space-y-2">
                {filtered.map(n => {
                    const config = typeConfig[n.type];
                    const Icon = config.icon;
                    return (
                        <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`group p-4 sm:p-5 rounded-2xl transition-all cursor-pointer relative ${n.read ? "glass-subtle opacity-70 hover:opacity-100" : "glass-primary shadow-md hover:shadow-lg"
                                }`}
                        >
                            {!n.read && <div className="absolute top-0 left-0 h-full w-1 bg-primary rounded-l-2xl" />}
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>
                                        {!n.read && <Badge className="bg-primary/20 text-primary border-none text-[8px] font-medium px-1.5 py-0 rounded-full">NEW</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {formatTimeAgo(n.timestamp)}
                                        </span>
                                        {n.amount && (
                                            <Badge className={`${config.bg} ${config.color} border-none text-[10px] font-medium`}>+${n.amount.toFixed(2)}</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    {!n.read && (
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={e => { e.stopPropagation(); markRead(n.id); }}>
                                            <Check className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-destructive/10" onClick={e => { e.stopPropagation(); dismiss(n.id); }}>
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center">
                        <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No notifications in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsCenter;
