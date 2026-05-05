import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Boxes, PackageMinus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const StockManagement = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStock = async () => {
        if (!user) return;
        const { data } = await supabase.from("products").select("id, title, stock_quantity, low_stock_threshold").eq("seller_id", user.id).order("created_at", { ascending: false });
        setProducts(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStock();
    }, [user]);

    const updateQuantity = async (id: string, newStock: number | null, newThreshold: number) => {
        const { error } = await supabase.from("products").update({
            stock_quantity: newStock,
            low_stock_threshold: newThreshold
        }).eq("id", id);

        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
        toast({ title: "Stock updated!" });
        fetchStock();
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Stock Management</h2>
                    <p className="text-muted-foreground font-medium">Monitor physical and digital inventory levels.</p>
                </div>
                <Boxes className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-4">
                {products.length === 0 ? (
                    <div className="p-10 rounded-[2rem] glass text-center flex flex-col items-center border-dashed">
                        <PackageMinus className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">No products found. Add products first to manage stock.</p>
                    </div>
                ) : (
                    <div className="rounded-[2rem] glass overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-primary/10 text-[10px] uppercase font-black text-muted-foreground tracking-widest bg-secondary/50">
                            <div className="col-span-5">Product</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-2">Stock Level</div>
                            <div className="col-span-2 text-right">Low Threshold</div>
                        </div>
                        <div className="divide-y divide-primary/10">
                            {products.map((p) => {
                                const isLowStock = p.stock_quantity !== null && p.stock_quantity <= (p.low_stock_threshold || 10);
                                const isOutOfStock = p.stock_quantity !== null && p.stock_quantity <= 0;

                                return (
                                    <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors">
                                        <div className="col-span-5 font-bold text-sm">{p.title}</div>
                                        <div className="col-span-3">
                                            {p.stock_quantity === null ? (
                                                <Badge className="bg-success/10 text-success border-none">Infinite (Digital)</Badge>
                                            ) : isOutOfStock ? (
                                                <Badge className="bg-destructive/10 text-destructive border-none">Out of Stock</Badge>
                                            ) : isLowStock ? (
                                                <Badge className="bg-warning/10 text-warning border-none flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" /> Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-primary/10 text-primary border-none">In Stock</Badge>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                value={p.stock_quantity === null ? "" : p.stock_quantity}
                                                onChange={(e) => {
                                                    const val = e.target.value === "" ? null : parseInt(e.target.value);
                                                    updateQuantity(p.id, val, p.low_stock_threshold);
                                                }}
                                                placeholder="∞"
                                                className="h-10 w-20 bg-secondary/50 border-none font-black"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Input
                                                type="number"
                                                value={p.low_stock_threshold}
                                                onChange={(e) => updateQuantity(p.id, p.stock_quantity, parseInt(e.target.value) || 10)}
                                                className="h-10 w-20 bg-secondary/50 border-none font-bold"
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockManagement;
