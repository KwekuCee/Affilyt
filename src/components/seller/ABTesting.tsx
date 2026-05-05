import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, Play, Square, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ABTesting = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Active Edit Form
    const [activeTestTarget, setActiveTestTarget] = useState<any>(null);
    const [form, setForm] = useState({ title_b: "", image_url_b: "" });

    const fetchProducts = async () => {
        if (!user) return;
        const { data } = await supabase.from("products").select("id, title, image_url, ab_test_active, title_b, image_url_b, views_a, views_b, sales_a, sales_b").eq("seller_id", user.id).order("created_at", { ascending: false });
        setProducts(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const toggleTest = async (id: string, currentlyActive: boolean) => {
        const { error } = await supabase.from("products").update({ ab_test_active: !currentlyActive }).eq("id", id);
        if (error) return toast({ title: "Error", variant: "destructive" });
        toast({ title: !currentlyActive ? "A/B test started!" : "A/B test stopped." });
        fetchProducts();
    };

    const saveTestConfig = async () => {
        if (!activeTestTarget) return;
        const { error } = await supabase.from("products").update({
            title_b: form.title_b,
            image_url_b: form.image_url_b
        }).eq("id", activeTestTarget.id);

        if (error) return toast({ title: "Error", variant: "destructive" });
        toast({ title: "Test variant updated" });
        setActiveTestTarget(null);
        fetchProducts();
    };

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">A/B Testing</h2>
                    <p className="text-muted-foreground font-medium">Test titles and images to optimize conversion rates.</p>
                </div>
                <FlaskConical className="h-10 w-10 text-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map(p => {
                    const totalViews = (p.views_a || 0) + (p.views_b || 0);
                    const crA = p.views_a > 0 ? ((p.sales_a / p.views_a) * 100).toFixed(1) : "0.0";
                    const crB = p.views_b > 0 ? ((p.sales_b / p.views_b) * 100).toFixed(1) : "0.0";
                    const winner = parseFloat(crA) >= parseFloat(crB) ? 'A' : 'B';

                    return (
                        <div key={p.id} className="p-6 rounded-[2rem] glass space-y-6 relative border border-primary/10">
                            <div className="flex justify-between items-start">
                                <Badge className={p.ab_test_active ? "bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground border-none"}>
                                    {p.ab_test_active ? "Active Test" : "Idle"}
                                </Badge>

                                <Dialog open={activeTestTarget?.id === p.id} onOpenChange={(o) => {
                                    if (o) {
                                        setActiveTestTarget(p);
                                        setForm({ title_b: p.title_b || "", image_url_b: p.image_url_b || "" });
                                    } else setActiveTestTarget(null);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary"><SettingsIcon className="w-4 h-4 text-muted-foreground" /></Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass">
                                        <DialogHeader><DialogTitle className="font-black italic uppercase text-2xl">Configure Variant B</DialogTitle></DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Test Title Variant</label>
                                                <Input value={form.title_b} onChange={e => setForm({ ...form, title_b: e.target.value })} placeholder="Alternative catchier title..." className="h-12 bg-secondary/50 border-none font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Test Image URL Variant</label>
                                                <Input value={form.image_url_b} onChange={e => setForm({ ...form, image_url_b: e.target.value })} placeholder="https://..." className="h-12 bg-secondary/50 border-none text-xs" />
                                            </div>
                                            <Button className="w-full h-12 uppercase font-black tracking-widest rounded-xl" onClick={saveTestConfig}>Save Configuration</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Target Product</p>
                                <h3 className="font-bold text-lg truncate pr-4" title={p.title}>{p.title}</h3>
                            </div>

                            <div className="bg-secondary/30 rounded-2xl p-4 grid grid-cols-2 gap-4">
                                <div className={`space-y-1 ${winner === 'A' && p.ab_test_active ? 'text-success' : ''}`}>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Original (A)</p>
                                    <p className="font-black text-xl">{crA}%</p>
                                    <p className="text-xs text-muted-foreground">{p.sales_a || 0} sales / {p.views_a || 0} views</p>
                                </div>
                                <div className={`space-y-1 ${winner === 'B' && p.ab_test_active ? 'text-success' : ''}`}>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Variant (B)</p>
                                    <p className="font-black text-xl">{crB}%</p>
                                    <p className="text-xs text-muted-foreground">{p.sales_b || 0} sales / {p.views_b || 0} views</p>
                                </div>
                            </div>

                            <Button
                                variant={p.ab_test_active ? "outline" : "default"}
                                className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs ${p.ab_test_active ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''}`}
                                onClick={() => toggleTest(p.id, p.ab_test_active)}
                                disabled={!p.title_b && !p.ab_test_active}
                            >
                                {p.ab_test_active ? (
                                    <><Square className="w-4 h-4 mr-2" /> Stop Test</>
                                ) : (
                                    <><Play className="w-4 h-4 mr-2" /> Start Test</>
                                )}
                            </Button>

                            {!p.title_b && !p.ab_test_active && (
                                <p className="text-[10px] text-center text-warning uppercase font-bold">Requires variant B configuration</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ABTesting;
