import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Award, TrendingUp, Zap, ShieldCheck, Star, CreditCard, Lock, UserPlus, Fingerprint, Mail, Building, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Step = 'plan' | 'form' | 'payment' | 'success';

import { useData, SellerTier as DataSellerTier } from "@/context/DataContext";
import DollarPaymentGateway from "@/components/DollarPaymentGateway";

const BecomeAffiliate = () => {
    const { toast } = useToast();
    const { setPackageType, setAffiliateLink, setRole } = useAuth();
    const { packages, exchangeRate } = useData();
    const [step, setStep] = useState<Step>('plan');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");

    const displayPackages = packages.map(pkg => ({
        ...pkg,
        description: pkg.name === "Basic" ? "Institutional entry for operational veterans. Does not include the comprehensive training suite." :
            pkg.name === "Standard" ? "The preferred accelerator path. Includes full training protocols and strategic support." :
                "The ultimate institutional package. Exclusive VIP benefits and direct executive routing.",
        features: [
            `${pkg.commission}% Recurring Commission`,
            pkg.name === "Basic" ? "Core Analytics Dashboard" : pkg.name === "Standard" ? "Full Training Program" : "Priority VIP Training",
            pkg.name === "Basic" ? "Monthly Payout Routing" : pkg.name === "Standard" ? "Bi-weekly Express Payouts" : "Weekly Express Payouts",
            "Global Partner Network",
            "Digital Asset Suite"
        ],
        icon: pkg.name === "Basic" ? Award : pkg.name === "Standard" ? Star : Zap,
        isPopular: pkg.name === "Standard",
        color: pkg.name === "Standard" ? "border-primary shadow-xl shadow-primary/10" : "border-slate-200 dark:border-slate-800"
    }));

    const [selectedPlan, setSelectedPlan] = useState(displayPackages[1]);

    const handleSelectPlan = (pkg: any) => {
        setSelectedPlan(pkg);
        setStep('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSuccess = () => {
        setPackageType(selectedPlan.name as any);
        const link = `ledger.xt/${username || 'user'}`;
        setAffiliateLink(link);
        setRole("AFFILIATE");
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-transparent">
            <LandingNavbar />

            <div className="pt-32 pb-20">
                <AnimatePresence mode="wait">
                    {step === 'plan' && (
                        <motion.section
                            key="plan"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="container mx-auto px-4"
                        >
                            <div className="text-center mb-16">
                                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">
                                    Institutional Onboarding
                                </Badge>
                                <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-foreground mb-6">
                                    Select Your <span className="text-primary italic">Inflow Tier.</span>
                                </h1>
                                <p className="text-muted-foreground font-medium italic">All packages are authorized for a 1-year operational cycle.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                {displayPackages.map((pkg, i) => (
                                    <motion.div
                                        key={pkg.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`relative flex flex-col p-8 md:p-12 rounded-[3.5rem] bg-card border-2 transition-all duration-500 scale-95 hover:scale-100 ${pkg.color} ${pkg.isPopular ? 'border-primary' : 'border-border'}`}
                                    >
                                        <div className="mb-8">
                                            <div className={`h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6`}>
                                                <pkg.icon className="h-7 w-7 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-widest italic">{pkg.name}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black text-foreground">${pkg.price}</span>
                                                <span className="text-muted-foreground font-bold italic">/year</span>
                                            </div>
                                            <p className="mt-4 text-xs font-medium text-muted-foreground leading-relaxed italic">{pkg.description}</p>
                                        </div>

                                        <div className="space-y-4 mb-10 flex-1">
                                            {pkg.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                                        <Check className="h-3 w-3 text-success" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-muted-foreground">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => handleSelectPlan(pkg)}
                                            className="w-full h-16 rounded-2xl font-black text-lg group italic"
                                        >
                                            Authorize Tier
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {step === 'form' && (
                        <motion.section
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="container mx-auto px-4 max-w-5xl"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4 space-y-8">
                                    <div className="p-8 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <selectedPlan.icon className="h-24 w-24" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-4 italic">Verification Protocol.</h3>
                                        <p className="text-sm opacity-60 leading-relaxed font-medium italic mb-8">
                                            You've selected the <span className="text-primary font-bold">{selectedPlan.name}</span> tier for your 1-year operational cycle.
                                        </p>
                                        <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Total to Pay</span>
                                            <span className="text-xl font-black">${selectedPlan.price}.00</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { icon: Lock, text: "End-to-End Encrypted Data" },
                                            { icon: CreditCard, text: "Secure Institutional Gateway" },
                                            { icon: ShieldCheck, text: "Verified Partner Program" }
                                        ].map(item => (
                                            <div key={item.text} className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4 text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-8 p-10 rounded-[3.5rem] bg-card border-2 border-border shadow-xl">
                                    <form onSubmit={handleFormSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Identity Credentials</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Legal Full Name</label>
                                                    <Input required className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="Sterling Cooper" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Business Email</label>
                                                    <Input type="email" required className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="sterling@cooper.com" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Preferred Username</label>
                                                    <Input required className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="sterling_ceo" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Security Password</label>
                                                    <Input type="password" required className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="••••••••••••" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Operational Details</h4>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Marketplace URL Request</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-14 rounded-2xl bg-secondary px-4 flex items-center text-xs font-black uppercase opacity-40">ledger.xt/</div>
                                                    <Input required value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold flex-1" placeholder="sterling" />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={isLoading} className="w-full h-20 rounded-[2rem] font-black text-xl italic flex gap-3 items-center justify-center shadow-2xl shadow-primary/30">
                                            Continue to Payment Verification
                                            <ArrowRight className="h-6 w-6" />
                                        </Button>
                                    </form>
                                    <div className="mt-8 flex justify-center gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className={`h-2 w-2 rounded-full ${i === 2 ? 'bg-primary' : 'bg-border'}`} />)}
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {step === 'payment' && (
                        <motion.section
                            key="payment"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="container mx-auto px-4"
                        >
                            <DollarPaymentGateway
                                amount={selectedPlan.price}
                                itemLabel={`${selectedPlan.name} Partner Tier (1-Year Subscription)`}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setStep('form')}
                            />
                        </motion.section>
                    )}

                    {step === 'success' && (
                        <motion.section
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="container mx-auto px-4 text-center max-w-2xl py-20"
                        >
                            <div className="h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-primary/40 relative">
                                <Check className="h-16 w-16 text-white" />
                                <motion.div
                                    className="absolute inset-x-[-20%] inset-y-[-20%] border-4 border-primary rounded-[3.5rem] opacity-20"
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <h2 className="text-5xl font-black text-foreground mb-6 underline decoration-primary decoration-4 underline-offset-8">Pending Approval.</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed italic font-medium mb-12">
                                Your <span className="text-primary font-bold">{selectedPlan.name}</span> tier payment of <span className="text-foreground font-black">${selectedPlan.price}.00</span> has been captured. Our executive council is now verifying your operational credentials.
                            </p>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Post-Payment Protocol</p>
                                <div className="flex gap-4 justify-center items-center">
                                    <div className="flex items-center gap-2 text-xs font-bold bg-secondary px-4 py-2 rounded-xl">
                                        <CheckCircle2 className="h-4 w-4 text-success" /> Payment Secured
                                    </div>
                                    <div className="h-1 w-8 bg-border" />
                                    <div className="flex items-center gap-2 text-xs font-bold bg-secondary px-4 py-2 rounded-xl">
                                        <div className="h-4 w-4 rounded-full border-2 border-primary animate-spin border-t-transparent" /> Credential Review
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => window.location.href = '/'} variant="ghost" className="mt-16 text-muted-foreground font-black uppercase text-xs tracking-widest underline decoration-2 underline-offset-8 transition-all hover:text-primary hover:decoration-primary">
                                Return to Intelligence Hub
                            </Button>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

export default BecomeAffiliate;
