import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff, Users, ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setIsLoading(false);
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
            return;
        }

        // Check if user is admin
        const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .eq("role", "admin")
            .maybeSingle();

        // Check if user has a package (paid affiliate)
        const { data: profileData } = await supabase
            .from("profiles")
            .select("package_tier")
            .eq("user_id", data.user.id)
            .single();

        setIsLoading(false);

        if (roleData) {
            toast({ title: "Welcome back, Admin!", description: "Redirecting to admin dashboard." });
            navigate("/dashboard/admin");
        } else if (profileData?.package_tier) {
            toast({ title: "Welcome back!", description: "Redirecting to your dashboard." });
            navigate("/dashboard/affiliate");
        } else {
            toast({ title: "No Active Package", description: "Please purchase a package to access your dashboard.", variant: "destructive" });
            await supabase.auth.signOut();
            navigate("/become-affiliate");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            <Link to="/">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ x: -5 }}
                    className="absolute top-8 left-8 z-50 flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                    <ArrowLeft className="h-4 w-4 text-primary group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Back to Home</span>
                </motion.div>
            </Link>

            <div className="container relative z-10 flex flex-col items-center max-w-6xl">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 flex flex-col items-center">
                    <Link to="/" className="flex items-center gap-2 group mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-foreground italic">AFFIL<span className="text-primary not-italic">YT.</span></span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-3xl overflow-hidden"
                >
                    <div className="bg-card/40 rounded-[2.8rem] p-8 md:p-12">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-black text-foreground mb-3 italic uppercase tracking-tight">
                                Welcome Back.
                            </h1>
                            <p className="text-sm font-medium text-muted-foreground">
                                Sign in to access your Affilyt dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="h-16 pl-12 rounded-2xl bg-secondary/80 border-2 border-transparent focus-visible:border-primary focus-visible:ring-0 font-bold"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="h-16 pl-12 pr-12 rounded-2xl bg-secondary/80 border-2 border-transparent focus-visible:border-primary focus-visible:ring-0 font-bold"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-[2rem] font-black text-lg group shadow-2xl shadow-primary/40 flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.3s]" />
                                        <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.15s]" />
                                        <div className="h-2 w-2 rounded-full bg-background animate-bounce" />
                                    </div>
                                ) : (
                                    <>Sign In <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-border/50 text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Don't have an account?
                                <Link to="/become-affiliate" className="text-primary font-black hover:underline ml-2">Join Affilyt</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                    Developed by <span className="text-primary italic">PRIME HAVEN.</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
