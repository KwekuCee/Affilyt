import { useState, useMemo } from "react";
import {
    Bell, DollarSign, CreditCard, Trophy, Check, CheckCheck,
    Filter, X, Clock
} from "lucide-react";
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

// Generate mock notifications
const generateNotifications = (): Notification[] => {
    const now = new Date();
    return [
        { id: "n1", type: "sale", title: "New Sale!", description: "Someone purchased Digital Marketing Mastery through your link.", timestamp: new Date(now.getTime() - 25 * 60 * 1000), read: false, amount: 29.10 },
        { id: "n2", type: "payout", title: "Payout Processed", description: "Your withdrawal of $150.00 has been sent to your MoMo account.", timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), read: false, amount: 150 },
        { id: "n3", type: "sale", title: "New Sale!", description: "E-Book Bundle Pack was purchased via your Instagram link.", timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), read: false, amount: 14.50 },
        { id: "n4", type: "contest", title: "New Contest Launched!", description: "\"Summer Sales Sprint\" is now live. Top seller wins $500 cash prize!", timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), read: true },
        { id: "n5", type: "sale", title: "New Sale!", description: "Premium Headphones sold. Commission: $29.85", timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), read: true, amount: 29.85 },
        { id: "n6", type: "payout", title: "Payout Confirmed", description: "Your $200.00 withdrawal was completed successfully.", timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), read: true, amount: 200 },
        { id: "n7", type: "sale", title: "New Sale!", description: "Online Cooking Academy sold via your WhatsApp share.", timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), read: true, amount: 20.65 },
        { id: "n8", type: "contest", title: "Contest Ending Soon", description: "\"March Madness Challenge\" ends in 2 days. You're currently #4!", timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), read: true },
        { id: "n9", type: "sale", title: "Double Sale!", description: "2 orders through your TikTok bio link today. Total commission: $38.40", timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), read: true, amount: 38.40 },
        { id: "n10", type: "payout", title: "Payout Initiated", description: "Withdrawal of $75.00 is being processed.", timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), read: true, amount: 75 },
    ];
};

const typeConfig: Record<NotificationType, { icon: any; color: string; bg: string }> = {
    sale: { icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    payout: { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
    contest: { icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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

    const markRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filters: { key: NotificationType | "all"; label: string; icon: any }[] = [
        { key: "all", label: "All", icon: Bell },
        { key: "sale", label: "Sales", icon: DollarSign },
        { key: "payout", label: "Payouts", icon: CreditCard },
        { key: "contest", label: "Contests", icon: Trophy },
    ];

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Bell className="h-10 w-10 text-primary" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground text-[10px] font-black flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Notifications</h2>
                        <p className="text-muted-foreground font-medium">Sale alerts, payout updates, and contest news.</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllRead} variant="outline" className="rounded-2xl font-black text-xs uppercase h-12 px-6">
                        <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
                    </Button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 flex-wrap">
                {filters.map(f => {
                    const count = f.key === "all" ? notifications.length : notifications.filter(n => n.type === f.key).length;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${filter === f.key
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                                }`}
                        >
                            <f.icon className="h-4 w-4" />
                            {f.label}
                            <span className={`ml-1 text-[10px] ${filter === f.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Notification List */}
            <div className="space-y-3">
                {filtered.map(n => {
                    const config = typeConfig[n.type];
                    const Icon = config.icon;
                    return (
                        <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`group p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${n.read
                                    ? "bg-card/30 border-border"
                                    : "bg-card/60 border-primary/20 shadow-lg"
                                } hover:border-primary/30 hover:shadow-xl`}
                        >
                            {!n.read && (
                                <div className="absolute top-0 left-0 h-full w-1 bg-primary rounded-l-full" />
                            )}

                            <div className="flex items-start gap-5">
                                <div className={`h-12 w-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0 mt-1`}>
                                    <Icon className={`h-6 w-6 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-black text-foreground ${!n.read ? "text-lg" : ""}`}>{n.title}</h3>
                                        {!n.read && <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-full">NEW</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">{n.description}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {formatTimeAgo(n.timestamp)}
                                        </span>
                                        {n.amount && (
                                            <Badge className={`${config.bg} ${config.color} border-none text-[10px] font-black`}>
                                                +${n.amount.toFixed(2)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!n.read && (
                                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={e => { e.stopPropagation(); markRead(n.id); }}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-destructive/10" onClick={e => { e.stopPropagation(); dismiss(n.id); }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="p-16 rounded-[2rem] bg-card/30 border-2 border-dashed border-border text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                        <p className="text-muted-foreground font-bold italic">No notifications in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsCenter;
