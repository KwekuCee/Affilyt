import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SubscriptionManagement = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();

    const currentPlan = profile?.subscription_plan || 'Free';
    const renewalDate = profile?.subscription_renewal_date ? new Date(profile.subscription_renewal_date).toLocaleDateString() : 'N/A';

    const [isLoading, setIsLoading] = useState(false);

    const upgradePlan = async (plan: string) => {
        setIsLoading(true);
        // Mock the upgrade process for the demo
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);

        const { error } = await supabase.from("profiles").update({
            subscription_plan: plan,
            subscription_renewal_date: futureDate.toISOString()
        }).eq("user_id", user?.id);

        setIsLoading(false);
        if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });

        toast({ title: `Upgraded to ${plan} Plan successfully!` });
        window.location.reload(); // Quick refresh for context to pick up
    };

    const TIERS = [
        { name: "Free", price: 0, features: ["5 Products Max", "Basic Analytics", "Standard Support", "10% Platform Fee"] },
        { name: "Pro", price: 29.99, features: ["Unlimited Products", "Advanced Analytics", "Priority Support", "5% Platform Fee", "A/B Testing", "Custom Domain"] },
        { name: "Elite", price: 99.99, features: ["Everything in Pro", "0% Platform Fee", "Dedicated Account Manager", "Custom API Access", "Automated Webinars"] }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Subscription</h2>
                    <p className="text-muted-foreground font-medium">Manage your vendor plan, billing, and renewals.</p>
                </div>
                <CreditCard className="h-10 w-10 text-primary" />
            </div>

            <div className="p-8 rounded-[2rem] glass-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-primary/20">
                <div>
                    <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Current Plan</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-4xl font-black uppercase text-foreground">{currentPlan}</h3>
                        {currentPlan !== 'Free' && <Badge className="bg-success text-success-foreground border-none">Active</Badge>}
                    </div>
                    <p className="text-sm font-medium mt-2 text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" /> Auto-renews on: <span className="font-bold text-foreground">{renewalDate}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {TIERS.map(tier => {
                    const isCurrent = currentPlan === tier.name;
                    return (
                        <div key={tier.name} className={`p-8 rounded-[2rem] flex flex-col justify-between ${isCurrent ? 'glass border-2 border-primary' : 'glass-subtle opacity-80 hover:opacity-100 transition-opacity'}`}>
                            <div>
                                {isCurrent && <Badge className="mb-4 bg-primary text-primary-foreground border-none">Current Plan</Badge>}
                                <h3 className="text-2xl font-black uppercase">{tier.name}</h3>
                                <div className="my-4">
                                    <span className="text-4xl font-black">${tier.price}</span>
                                    <span className="text-sm text-muted-foreground font-bold">/mo</span>
                                </div>
                                <div className="space-y-3 mt-8">
                                    {tier.features.map(f => (
                                        <div key={f} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-sm font-medium">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-primary/10">
                                <Button
                                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                                    variant={isCurrent ? "outline" : "default"}
                                    disabled={isCurrent || isLoading}
                                    onClick={() => upgradePlan(tier.name)}
                                >
                                    {isCurrent ? "Active Plan" : `Upgrade to ${tier.name}`}
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
