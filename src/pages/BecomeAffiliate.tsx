import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Award, Zap, ShieldCheck, Star, CreditCard, Lock, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import DollarPaymentGateway from "@/components/DollarPaymentGateway";
import { supabase } from "@/integrations/supabase/client";

type Step = 'plan' | 'form' | 'payment' | 'success';

const BecomeAffiliate = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { packages, exchangeRate } = useData();
    const [step, setStep] = useState<Step>('plan');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const displayPackages = packages.map(pkg => ({
        ...pkg,
        description: pkg.name === "Basic" ? "Great for beginners. Includes basic tools to start selling." :
            pkg.name === "Standard" ? "Our most popular choice. Includes full training and support." :
                "The absolute best. Includes VIP benefits and priority help.",
        features: [
            `${pkg.commission}% Recurring Commission`,
            pkg.name === "Basic" ? "Basic Analytics" : pkg.name === "Standard" ? "Full Training Program" : "Priority VIP Training",
            pkg.name === "Basic" ? "Monthly Payouts" : pkg.name === "Standard" ? "Every Two Weeks" : "Weekly Payouts",
            "Partner Network",
            "Marketing Tools"
        ],
        icon: pkg.name === "Basic" ? Award : pkg.name === "Standard" ? Star : Zap,
        isPopular: pkg.name === "Standard",
        color: pkg.name === "Standard" ? "border-primary shadow-xl shadow-primary/10" : "border-border"
    }));

    const [selectedPlan, setSelectedPlan] = useState(displayPackages[1]);

    const handleSelectPlan = (pkg: any) => {
        setSelectedPlan(pkg);
        setStep('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Create the user account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: window.location.origin,
            }
        });

        if (signUpError) {
            setIsLoading(false);
            toast({ title: "Registration Failed", description: signUpError.message, variant: "destructive" });
            return;
        }

        setIsLoading(false);
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSuccess = async () => {
        // Update profile with package tier and affiliate link
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const link = `affilyt.lovable.app/marketplace?ref=${username || user.id.slice(0, 8)}`;
            await supabase.from("profiles").update({
                package_tier: selectedPlan.name,
                affiliate_link: link,
                full_name: fullName,
            }).eq("user_id", user.id);

            // Add affiliate role
            await supabase.from("user_roles").insert({
                user_id: user.id,
                role: "affiliate" as any,
            });
        }

        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-transparent">
            <LandingNavbar />
            <div className="pt-32 pb-20">
                <AnimatePresence mode="wait">
                    {step === 'plan' && (
                        <motion.section key="plan" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">GET STARTED</Badge>
                                <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-foreground mb-6">
                                    Choose Your <span className="text-primary italic">Plan.</span>
                                </h1>
                                <p className="text-muted-foreground font-medium italic">All plans last for 1 entire year.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                {displayPackages.map((pkg, i) => (
                                    <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className={`relative flex flex-col p-8 md:p-12 rounded-[3.5rem] glass transition-all duration-500 scale-95 hover:scale-100 ${pkg.color} ${pkg.isPopular ? 'border-primary' : 'border-transparent'}`}>
                                        <div className="mb-8">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
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
                                        <Button onClick={() => handleSelectPlan(pkg)} className="w-full h-16 rounded-2xl font-black text-lg group italic">
                                            Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {step === 'form' && (
                        <motion.section key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="container mx-auto px-4 max-w-5xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4 space-y-8">
                                    <div className="p-8 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden">
                                        <h3 className="text-2xl font-black mb-4 italic">Create Your Account.</h3>
                                        <p className="text-sm opacity-60 leading-relaxed font-medium italic mb-8">
                                            You've selected the <span className="text-primary font-bold">{selectedPlan.name}</span> tier — ${selectedPlan.price}/year.
                                        </p>
                                        <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                                            <span className="text-xl font-black">${selectedPlan.price}.00</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Lock, text: "Secure Account Creation" },
                                            { icon: CreditCard, text: "Secure Payment Gateway" },
                                            { icon: ShieldCheck, text: "Verified Partner Program" }
                                        ].map(item => (
                                            <div key={item.text} className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4 text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-8 p-10 rounded-[3.5rem] glass shadow-xl">
                                    <form onSubmit={handleFormSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Account Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Name</label>
                                                    <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="John Doe" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</label>
                                                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="you@email.com" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Username</label>
                                                    <Input required value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="johndoe" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Password</label>
                                                    <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="••••••••••••" minLength={6} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Affiliate Link</h4>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Your Referral URL</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-14 rounded-2xl bg-secondary px-4 flex items-center text-xs font-black uppercase opacity-40">affilyt.lovable.app/marketplace?ref=</div>
                                                    <Input required value={username} onChange={(e) => setUsername(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold flex-1" placeholder="johndoe" />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={isLoading} className="w-full h-20 rounded-[2rem] font-black text-xl italic flex gap-3 items-center justify-center shadow-2xl shadow-primary/30">
                                            {isLoading ? "Creating Account..." : "Continue to Payment"}
                                            {!isLoading && <ArrowRight className="h-6 w-6" />}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {step === 'payment' && (
                        <motion.section key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="container mx-auto px-4">
                            <DollarPaymentGateway
                                amount={selectedPlan.price}
                                itemLabel={`${selectedPlan.name} Affilyt Package (1-Year)`}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setStep('form')}
                            />
                        </motion.section>
                    )}

                    {step === 'success' && (
                        <motion.section key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-4 text-center max-w-2xl py-20">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-primary/40 relative">
                                <Check className="h-16 w-16 text-white" />
                            </div>
                            <h2 className="text-5xl font-black text-foreground mb-6">Welcome to Affilyt!</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed italic font-medium mb-12">
                                Your <span className="text-primary font-bold">{selectedPlan.name}</span> package has been activated. Please check your email to verify your account, then log in.
                            </p>
                            <div className="space-y-4">
                                <Button onClick={() => navigate("/login")} className="h-16 px-10 rounded-2xl font-black text-lg">
                                    Go to Login <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </div>
    );
};

export default BecomeAffiliate;
