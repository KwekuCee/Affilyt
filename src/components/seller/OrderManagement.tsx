import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, RotateCcw, MessageSquare, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const OrderManagement = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        if (!user) return;
        const { data } = await supabase.from("orders").select("*, products(title)").eq("seller_id", user.id).order("created_at", { ascending: false });
        setOrders(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from("orders").update({ status }).eq("id", id);
        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
        toast({ title: `Order ${status}` });
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success/10 text-success border-none';
            case 'refunded': return 'bg-destructive/10 text-destructive border-none';
            case 'fulfilled': return 'bg-primary/10 text-primary border-none';
            case 'pending': return 'bg-warning/10 text-warning border-none';
            default: return 'bg-secondary text-muted-foreground border-none';
        }
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Order Management</h2>
                    <p className="text-muted-foreground font-medium">Track, fulfill, and manage your sales.</p>
                </div>
                <Package className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="p-10 rounded-[2rem] glass text-center flex flex-col items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground font-bold">No orders yet.</p>
                    </div>
                ) : (
                    orders.map((o) => (
                        <div key={o.id} className="p-6 rounded-[2rem] glass flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="space-y-1 flex-1">
                                <div className="flex gap-2 items-center mb-2">
                                    <Badge className={getStatusColor(o.status)}>{o.status}</Badge>
                                    <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                                </div>
                                <h3 className="font-black text-sm">{o.products?.title || "Unknown Product"}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    Buyer: <span className="font-bold text-foreground">{o.buyer_email}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono">{o.id.split('-')[0]}</span></p>
                            </div>

                            <div className="text-left md:text-right w-full md:w-auto">
                                <p className="text-[10px] uppercase text-muted-foreground">Total Paid</p>
                                <p className="font-black text-xl">${Number(o.amount).toFixed(2)}</p>
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
                                {o.status === "pending" || o.status === "completed" ? (
                                    <Button size="sm" variant="outline" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary" onClick={() => updateStatus(o.id, 'fulfilled')}>
                                        <Truck className="h-4 w-4 mr-1" /> Fulfill
                                    </Button>
                                ) : null}

                                {o.status !== "refunded" ? (
                                    <Button size="sm" variant="outline" className="bg-destructive/5 hover:bg-destructive/10 border-destructive/20 text-destructive" onClick={() => updateStatus(o.id, 'refunded')}>
                                        <RotateCcw className="h-4 w-4 mr-1" /> Refund
                                    </Button>
                                ) : null}

                                <Button size="sm" variant="secondary" onClick={() => window.location.href = `mailto:${o.buyer_email}`}>
                                    <MessageSquare className="h-4 w-4 mr-1" /> Message
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
