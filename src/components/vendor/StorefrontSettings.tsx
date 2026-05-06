import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Store, PaintBucket, Type, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/admin/ImageUploader";

const StorefrontSettings = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        business_name: "",
        store_color_hex: "#10b981",
        store_banner_url: "",
        store_logo_url: "",
        business_description: "",
        business_website: ""
    });

    useEffect(() => {
        if (profile) {
            setForm({
                business_name: profile.business_name || "",
                store_color_hex: profile.store_color_hex || "#10b981",
                store_banner_url: profile.store_banner_url || "",
                store_logo_url: profile.store_logo_url || "",
                business_description: profile.business_description || "",
                business_website: profile.business_website || ""
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        const { error } = await supabase.from("profiles").update({
            business_name: form.business_name,
            store_color_hex: form.store_color_hex,
            store_banner_url: form.store_banner_url,
            store_logo_url: form.store_logo_url,
            business_description: form.business_description,
            business_website: form.business_website,
        }).eq("user_id", user.id);

        setIsSaving(false);
        if (error) return toast({ title: "Error saving", description: error.message, variant: "destructive" });

        toast({ title: "Storefront aesthetics updated!" });
        refreshProfile();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Storefront</h2>
                    <p className="text-muted-foreground font-medium">Customize your public vendor landing page.</p>
                </div>
                <Store className="h-10 w-10 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] glass space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Type className="w-4 h-4" /> Identity
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Store Name</label>
                            <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Catchphrase / Description</label>
                            <textarea value={form.business_description} onChange={(e) => setForm({ ...form, business_description: e.target.value })} className="w-full min-h-[100px] p-4 rounded-2xl bg-secondary border-none font-bold outline-none resize-none text-sm" placeholder="We sell the best..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><LinkIcon className="w-3 h-3" /> External Link</label>
                            <Input value={form.business_website} onChange={(e) => setForm({ ...form, business_website: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="https://..." />
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] glass space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <PaintBucket className="w-4 h-4" /> Assets & Colors
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Brand Color Hex</label>
                            <div className="flex gap-4">
                                <input type="color" value={form.store_color_hex} onChange={(e) => setForm({ ...form, store_color_hex: e.target.value })} className="h-14 w-14 rounded-xl border-none bg-transparent cursor-pointer" />
                                <Input value={form.store_color_hex} onChange={(e) => setForm({ ...form, store_color_hex: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-mono font-bold flex-1 uppercase" placeholder="#FFFFFF" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Store Logo</label>
                            <ImageUploader value={form.store_logo_url} folder={`seller_assets/${user?.id}`} onChange={(url) => setForm({ ...form, store_logo_url: url })} label="Upload Logo (Square)" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Cover Banner</label>
                            <ImageUploader value={form.store_banner_url} folder={`seller_assets/${user?.id}`} onChange={(url) => setForm({ ...form, store_banner_url: url })} label="Upload Banner (16:9)" />
                        </div>
                    </div>
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Storefront"}
                    </Button>
                </div>

                {/* Live Preview Pane */}
                <div className="relative p-2 rounded-[2rem] border border-primary/20 bg-background/50 h-fit sticky top-20">
                    <div className="absolute -top-3 left-6 bg-background px-2 text-[10px] font-black text-primary uppercase tracking-widest">Live Preview</div>
                    <div className="rounded-[1.5rem] overflow-hidden bg-secondary relative">
                        {/* Banner */}
                        {form.store_banner_url ? (
                            <img src={form.store_banner_url} className="w-full h-40 object-cover" alt="Banner" />
                        ) : (
                            <div className="w-full h-40 bg-muted/20 flex items-center justify-center font-black text-muted-foreground opacity-50 uppercase tracking-widest">No Banner</div>
                        )}

                        {/* Profile Avatar / Logo overlay */}
                        <div className="absolute top-24 left-6">
                            <div className="h-20 w-20 rounded-2xl border-4 border-secondary bg-background overflow-hidden relative">
                                {form.store_logo_url ? <img src={form.store_logo_url} className="w-full h-full object-cover" /> : <Store className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30 h-8 w-8" />}
                            </div>
                        </div>

                        <div className="pt-8 pb-6 px-6">
                            <h4 className="font-black text-2xl truncate">{form.business_name || "Your Store Name"}</h4>
                            <p className="text-xs text-muted-foreground mt-1 mb-4 line-clamp-2">{form.business_description || "Find premium digital products directly from our exclusive catalog here."}</p>

                            <div className="w-full h-10 rounded-xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: form.store_color_hex, color: '#fff' }}>
                                Browse Products
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorefrontSettings;
