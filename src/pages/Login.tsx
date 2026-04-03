import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Github, Twitter, Eye, EyeOff, Terminal, Cpu, Key, Fingerprint, ShieldAlert, Globe, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Login = () => {
    const [loginType, setLoginType] = useState<"affiliate" | "admin">("affiliate");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setRole } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate auth
        setTimeout(() => {
            if (loginType === "admin") {
                setRole("SUPERADMIN");
                navigate("/dashboard/admin");
            } else {
                setRole("AFFILIATE");
                navigate("/dashboard/affiliate");
            }
            setIsLoading(false);
            toast({
                title: `${loginType === "admin" ? "SuperAdmin" : "Partner"} Access Granted`,
                description: `Successfully authenticated with the Executive Ledger.`,
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Back Button */}
            <Link to="/">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ x: -5 }}
                    className="absolute top-8 left-8 z-50 flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                    <ArrowLeft className="h-4 w-4 text-primary group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Return to Hub</span>
                </motion.div>
            </Link>

            <div className="container relative z-10 flex flex-col items-center max-w-6xl">
                {/* Brand Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8 flex flex-col items-center"
                >
                    <Link to="/" className="flex items-center gap-2 group mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-foreground italic">THE <span className="text-primary not-italic">LEDGER.</span></span>
                    </Link>
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-2 text-[10px] font-black uppercase tracking-[0.3em] bg-background/50 backdrop-blur-sm">
                        Executive Access Portal
                    </Badge>
                </motion.div>

                {/* Glass Login Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-3xl overflow-hidden"
                >
                    <div className="bg-card/40 rounded-[2.8rem] p-8 md:p-12">
                        {/* Tab Toggle */}
                        <div className="flex bg-secondary/50 p-2 rounded-[2rem] mb-12 relative overflow-hidden">
                            <motion.div
                                className="absolute top-2 left-2 h-[calc(100%-16px)] w-[calc(50%-8px)] bg-primary rounded-[1.5rem] shadow-lg shadow-primary/30"
                                animate={{ x: loginType === "affiliate" ? 0 : "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <button
                                onClick={() => setLoginType("affiliate")}
                                className={`flex-1 flex items-center justify-center gap-2 h-12 relative z-10 text-xs font-black uppercase tracking-widest transition-colors ${loginType === "affiliate" ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Users className="h-4 w-4" /> Partner Login
                            </button>
                            <button
                                onClick={() => setLoginType("admin")}
                                className={`flex-1 flex items-center justify-center gap-2 h-12 relative z-10 text-xs font-black uppercase tracking-widest transition-colors ${loginType === "admin" ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Terminal className="h-4 w-4" /> Execution Node
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={loginType}
                                initial={{ opacity: 0, x: loginType === "affiliate" ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: loginType === "affiliate" ? 10 : -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-10 text-center md:text-left">
                                    <h1 className="text-3xl font-black text-foreground mb-3 italic uppercase tracking-tight">
                                        {loginType === "affiliate" ? "Access Inflow Portal." : "SuperAdmin Override."}
                                    </h1>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {loginType === "affiliate"
                                            ? "Initialize your affiliate credentials to manage rewards."
                                            : "System-level entry requested. Administrative tracking enabled."}
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                            {loginType === "admin" ? "Admin Identifier" : "Work Email"}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
                                            <div className="relative">
                                                {loginType === "admin" ? <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
                                                <Input
                                                    type={loginType === "admin" ? "text" : "email"}
                                                    placeholder={loginType === "admin" ? "SA-901-X" : "name@company.com"}
                                                    className="h-16 pl-12 rounded-2xl bg-secondary/80 border-2 border-transparent focus-visible:border-primary focus-visible:ring-0 font-black italic shadow-inner"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</label>
                                            <button type="button" className="text-[10px] font-black uppercase text-primary hover:underline">Forgot Access?</button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••••••"
                                                    className="h-16 pl-12 pr-12 rounded-2xl bg-secondary/80 border-2 border-transparent focus-visible:border-primary focus-visible:ring-0 font-black italic shadow-inner"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {loginType === "admin" && (
                                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/5 border border-warning/10 text-warning">
                                            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Authorized hardware key detected via BIOS. Biometric verification pending after password entry.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-20 rounded-[2rem] font-black text-xl italic group shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.3s]" />
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.15s]" />
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce" />
                                            </div>
                                        ) : (
                                            <>
                                                {loginType === "admin" ? "Initialize Override" : "Access Partnership Hub"}
                                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-12 pt-10 border-t border-border/50 text-center">
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-8">Institutional Authentication Matrix</p>
                            <div className="flex justify-center gap-12 text-muted-foreground">
                                <Globe className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                                <Shield className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                                <Cpu className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                            </div>

                            {loginType === "affiliate" && (
                                <p className="mt-12 text-sm font-medium text-muted-foreground italic">
                                    New to the ecosystem?
                                    <Link to="/become-affiliate" className="text-primary font-black hover:underline px-2 not-italic ml-1">Join the Inflow Elite</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Global Footer Credit */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3"
                >
                    Operating on Execution Node 42-X. Developed by <span className="text-primary italic">PRIME HAVEN.</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
