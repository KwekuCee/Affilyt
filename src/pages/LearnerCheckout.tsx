import { BookOpen, Lock, ShieldCheck, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const LearnerCheckout = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (authError) throw authError;

            // Simulate payment processing delay
            await new Promise(res => setTimeout(res, 2000));

            if (authData.user) {
                await supabase.from("profiles").update({
                    full_name: name,
                    role: "learner"
                }).eq("id", authData.user.id);
            }

            alert("Payment processed successfully. Welcome to the Learner Ecosystem!");
            navigate("/dashboard/learner");

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <LandingNavbar />

            <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge variant="outline" className="mb-4 text-blue-500 border-blue-500/30 bg-blue-500/10">Student Access</Badge>
                            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">Master high-income skills.</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get full lifetime access to our premium digital learning marketplace, signal rooms, and exclusive educational products.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                            {/* Benefits */}
                            <div className="lg:col-span-3 space-y-6">
                                <h2 className="text-2xl font-display font-bold mb-6">What you get inside:</h2>

                                {[
                                    { icon: BookOpen, title: "Premium Courses", desc: "Access high-ticket programs curated by top experts.", color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { icon: Zap, title: "Live Trade Signals", desc: "Join exclusive rooms for Forex, Crypto, and Arbitrage.", color: "text-amber-500", bg: "bg-amber-500/10" },
                                    { icon: Star, title: "Verified Vendor Material", desc: "Every piece of content is strictly vetted by our admins.", color: "text-primary", bg: "bg-primary/10" },
                                ].map((ben) => (
                                    <div key={ben.title} className="p-6 rounded-3xl glass-subtle border-white/5 flex gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${ben.bg}`}>
                                            <ben.icon className={`w-7 h-7 ${ben.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{ben.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{ben.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Checkout Form Card */}
                            <div className="lg:col-span-2">
                                <div className="p-8 rounded-3xl glass border border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl pointer-events-none" />

                                    <div className="mb-8 border-b border-white/10 pb-6">
                                        <h3 className="font-display text-2xl font-bold">Learner Access</h3>
                                        <div className="flex items-baseline gap-1 mt-2">
                                            <span className="font-display text-5xl font-black">$5</span>
                                            <span className="text-muted-foreground font-medium">/lifetime access</span>
                                        </div>
                                    </div>

                                    <form className="space-y-4 mb-8" onSubmit={handleCheckout}>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Full Name</label>
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-12 px-4 rounded-xl glass-input text-sm" placeholder="John Doe" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Email Address</label>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-xl glass-input text-sm" placeholder="john@example.com" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Create Password</label>
                                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 px-4 rounded-xl glass-input text-sm" placeholder="••••••••" required />
                                        </div>

                                        <div className="pt-4">
                                            <Button disabled={isLoading} className="w-full h-14 text-sm font-bold tracking-wider" size="lg" type="submit">
                                                <Lock className="w-4 h-4 mr-2" /> {isLoading ? "Processing..." : "Pay $5 securely & Unlock"}
                                            </Button>
                                            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Secured by Stripe & Korapay</p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LearnerCheckout;
