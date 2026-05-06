import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REGIONS = [
    { code: 'GH', name: 'Ghana', defaultVat: 15 },
    { code: 'NG', name: 'Nigeria', defaultVat: 7.5 },
    { code: 'US', name: 'United States', defaultVat: 8 },
    { code: 'UK', name: 'United Kingdom', defaultVat: 20 },
];

const TaxSettings = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [taxes, setTaxes] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile && profile.tax_regions) {
            setTaxes(profile.tax_regions as Record<string, number>);
        } else {
            // Default initialization
            const defaultTaxes: Record<string, number> = {};
            REGIONS.forEach(r => defaultTaxes[r.code] = 0);
            setTaxes(defaultTaxes);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        const { error } = await supabase.from("profiles").update({
            tax_regions: taxes
        }).eq("user_id", user.id);

        setIsSaving(false);
        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });

        toast({ title: "Tax settings configured" });
        refreshProfile();
    };

    const updateTax = (code: string, val: string) => {
        const num = parseFloat(val);
        setTaxes(prev => ({ ...prev, [code]: isNaN(num) ? 0 : num }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Sales Tax & VAT</h2>
                    <p className="text-muted-foreground font-medium">Configure regional tax rules applied at checkout.</p>
                </div>
                <Calculator className="h-10 w-10 text-primary" />
            </div>

            <div className="p-8 rounded-[2rem] glass max-w-3xl">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-primary/10">
                    <Globe className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-bold text-muted-foreground">Set percentage (%) tax rates that automatically apply based on the buyer's billing country.</p>
                </div>

                <div className="space-y-6">
                    {REGIONS.map(region => (
                        <div key={region.code} className="flex justify-between items-center bg-secondary/50 p-4 rounded-2xl">
                            <div>
                                <h4 className="font-black text-lg">{region.name}</h4>
                                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Region Code: {region.code}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest hidden sm:block">Standard VAT: {region.defaultVat}%</p>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={taxes[region.code] === undefined ? "" : taxes[region.code]}
                                        onChange={(e) => updateTax(region.code, e.target.value)}
                                        className="h-14 w-32 rounded-xl border-none bg-background font-black text-lg text-right pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button className="w-full h-14 rounded-xl font-black uppercase tracking-widest" onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Tax Configuration"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TaxSettings;
