import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Copy, Trash2, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const CouponCodes = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [productId, setProductId] = useState("");
    const [maxUses, setMaxUses] = useState("");
    const [validUntil, setValidUntil] = useState("");

    const fetchData = async () => {
        if (!user) return;
        const [couponsRes, productsRes] = await Promise.all([
            supabase.from("seller_coupons").select("*, products(title)").eq("seller_id", user.id).order("created_at", { ascending: false }),
            supabase.from("products").select("id, title").eq("seller_id", user.id)
        ]);

        setCoupons(couponsRes.data || []);
        setProducts(productsRes.data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleCreate = async () => {
        if (!user || !code || !discount) return toast({ title: "Incomplete fields", variant: "destructive" });

        const payload = {
            seller_id: user.id,
            code: code.toUpperCase().replace(/\s/g, ''),
            discount_percent: parseFloat(discount),
            product_id: productId || null,
            max_uses: maxUses ? parseInt(maxUses) : null,
            valid_until: validUntil ? new Date(validUntil).toISOString() : null,
        };

        const { error } = await supabase.from("seller_coupons").insert(payload);
        if (error) return toast({ title: "Error creating coupon", description: error.message, variant: "destructive" });

        toast({ title: "Coupon created successfully!" });
        setIsDialogOpen(false);
        setCode(""); setDiscount(""); setProductId(""); setMaxUses(""); setValidUntil("");
        fetchData();
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from("seller_coupons").update({ is_active: !currentStatus }).eq("id", id);
        if (error) return toast({ title: "Error", variant: "destructive" });
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon code?")) return;
        await supabase.from("seller_coupons").delete().eq("id", id);
        fetchData();
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Coupon Codes</h2>
                    <p className="text-muted-foreground font-medium">Create promotional discounts for your buyers.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 uppercase font-black tracking-wider"><Plus className="h-4 w-4 mr-2" /> New Coupon</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass border-primary/20">
                        <DialogHeader><DialogTitle className="text-2xl font-black italic uppercase">Create Coupon</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Code Name</label>
                                    <Input placeholder="SUMMER50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="bg-secondary/50 border-none h-12 font-bold tracking-widest uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Discount %</label>
                                    <Input type="number" placeholder="25" value={discount} onChange={(e) => setDiscount(e.target.value)} className="bg-secondary/50 border-none h-12 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase">Target Product</label>
                                <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-12 rounded-md bg-secondary/50 border-none px-3 text-sm font-medium">
                                    <option value="">Storewide</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Max Uses (Opt)</label>
                                    <Input type="number" placeholder="100" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} className="bg-secondary/50 border-none h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase">Valid Until (Opt)</label>
                                    <Input type="datetime-local" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="bg-secondary/50 border-none h-12 text-xs" />
                                </div>
                            </div>
                            <Button className="w-full h-12 mt-4 font-black uppercase tracking-wider" onClick={handleCreate}>Generate Code</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.length === 0 ? (
                    <div className="col-span-full p-10 rounded-[2rem] glass text-center flex flex-col items-center border-dashed">
                        <Ticket className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">No coupons created yet.</p>
                    </div>
                ) : (
                    coupons.map(c => (
                        <div key={c.id} className="p-6 rounded-[2rem] glass-subtle flex justify-between items-center group">
                            <div className="flex gap-4 items-center">
                                <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${c.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <span className="font-black text-2xl">{c.discount_percent}%</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest">OFF</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-widest">{c.code}</h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            {c.products?.title || 'Storewide'}
                                        </span>
                                        {(c.max_uses || c.valid_until) ? (
                                            <span className="text-[10px] flex items-center gap-2 text-warning font-medium">
                                                {c.max_uses && `Uses: ${c.current_uses}/${c.max_uses}`}
                                                {c.valid_until && <span className="flex items-center"><Calendar className="w-3 h-3 mx-1" /> Expires soon</span>}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`cursor-pointer ${c.is_active ? 'border-success text-success' : ''}`} onClick={() => handleToggle(c.id, c.is_active)}>
                                        {c.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary" onClick={() => {
                                        navigator.clipboard.writeText(c.code);
                                        toast({ title: "Code copied!" });
                                    }}>
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CouponCodes;
