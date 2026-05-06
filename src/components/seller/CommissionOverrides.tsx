import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Percent, Star, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CommissionOverrides = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [overrides, setOverrides] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formAffiliateEmail, setFormAffiliateEmail] = useState("");
    const [formProductId, setFormProductId] = useState("");
    const [formRate, setFormRate] = useState("");

    const fetchData = async () => {
        if (!user) return;
        const [overridesRes, productsRes] = await Promise.all([
            supabase.from("commission_overrides").select("*, products(title)").eq("seller_id", user.id),
            supabase.from("products").select("id, title").eq("seller_id", user.id)
        ]);

        // Attempt to fetch profile emails for the overrides to display
        let finalOverrides = overridesRes.data || [];
        if (finalOverrides.length > 0) {
            const authIds = finalOverrides.map(o => o.affiliate_id);
            const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", authIds);
            finalOverrides = finalOverrides.map(o => {
                const p = profiles?.find((profile: any) => profile.user_id === o.affiliate_id);
                return { ...o, affiliate_name: p?.full_name };
            });
        }

        setOverrides(finalOverrides);
        setProducts(productsRes.data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleCreate = async () => {
        if (!user || !formAffiliateEmail || !formRate) return toast({ title: "Incomplete fields", variant: "destructive" });

        // Resolve affiliate ID from full name
        const { data: profiles } = await supabase.from("profiles").select("user_id").ilike("full_name", formAffiliateEmail).maybeSingle();
        if (!profiles) return toast({ title: "Affiliate not found", description: "No affiliate matches that name", variant: "destructive" });

        const payload = {
            seller_id: user.id,
            affiliate_id: profiles.user_id,
            product_id: formProductId || null,
            commission_rate: parseFloat(formRate)
        };

        const { error } = await supabase.from("commission_overrides").insert(payload);
        if (error) {
            return toast({ title: "Error creating override", description: error.message, variant: "destructive" });
        }

        toast({ title: "Commission Override created!" });
        setIsDialogOpen(false);
        setFormAffiliateEmail("");
        setFormProductId("");
        setFormRate("");
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this commission override?")) return;
        const { error } = await supabase.from("commission_overrides").delete().eq("id", id);
        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
        toast({ title: "Override removed" });
        fetchData();
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Commission Overrides</h2>
                    <p className="text-muted-foreground font-medium">Reward VIP affiliates with custom commission rates.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl h-12 uppercase font-black tracking-wider"><Plus className="h-4 w-4 mr-2" /> New Override</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass border-primary/20">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black italic uppercase">Create Override</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Affiliate Full Name</label>
                                <Input placeholder="Jane Doe" value={formAffiliateEmail} onChange={(e) => setFormAffiliateEmail(e.target.value)} className="bg-secondary/50 border-none h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Target Product (Optional)</label>
                                <select value={formProductId} onChange={(e) => setFormProductId(e.target.value)} className="w-full h-12 rounded-md bg-secondary/50 border-none px-3 text-sm font-medium">
                                    <option value="">Storewide (All Products)</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Custom Commission %</label>
                                <Input type="number" placeholder="75" value={formRate} onChange={(e) => setFormRate(e.target.value)} className="bg-secondary/50 border-none h-12" />
                            </div>
                            <Button className="w-full h-12 mt-4 font-black uppercase tracking-wider" onClick={handleCreate}>Save Override</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overrides.length === 0 ? (
                    <div className="col-span-full p-10 rounded-[2rem] glass text-center flex flex-col items-center justify-center border-dashed">
                        <Percent className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">No VIP commission overrides yet.</p>
                    </div>
                ) : (
                    overrides.map(o => (
                        <div key={o.id} className="p-6 rounded-[2rem] glass-subtle relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-10 transform rotate-12 transition-transform group-hover:rotate-45">
                                <Star className="w-32 h-32 text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black text-xl text-primary">{o.commission_rate}%</h3>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(o.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm font-bold text-foreground mt-2">{o.affiliate_name || 'VIP Affiliate'}</p>
                                    <p className="text-xs text-muted-foreground">{o.affiliate_name || 'Unknown Affiliate'}</p>
                                </div>
                                <div className="inline-flex">
                                    <span className="text-[10px] font-black tracking-widest uppercase bg-secondary/50 px-3 py-1 rounded-full text-foreground/70">
                                        {o.products?.title ? `Product: ${o.products.title.substring(0, 15)}...` : 'Storewide'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommissionOverrides;
