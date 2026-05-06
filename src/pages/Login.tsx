import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Check your inputs", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    if (error) {
      setLoading(false);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const set = new Set((roles || []).map((r: any) => r.role));
    const { data: prof } = await supabase.from("profiles").select("package_tier").eq("user_id", data.user.id).maybeSingle();
    setLoading(false);

    const roleNames = Array.from(set);
    console.log("Found roles for user:", roleNames);
    console.log("Profile data:", prof);

    if (set.has("admin")) {
      navigate("/dashboard/admin");
    } else if (set.has("seller")) {
      navigate("/dashboard/vendor");
    } else if (set.has("learner")) {
      navigate("/dashboard/learner");
    } else if (set.has("affiliate") || prof?.package_tier) {
      navigate("/dashboard/affiliate");
    } else {
      // Fallback: Check if the user is a learner based on other profile cues
      // If we can't find a role, it might be due to RLS or missing role record
      toast({
        title: "Access Restricted",
        description: "We couldn't confirm your active plan. If you just signed up, please wait a moment or contact support.",
        variant: "destructive"
      });
      console.error("Login redirect failed: User has no recognized roles or package tier.");
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Affilyt</span>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to continue to your dashboard.</p>
        </div>

        <div className="glass rounded-xl p-8 shadow-elevated">
          <form onSubmit={handle} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-9" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2 shadow-glow">
              {loading ? "Signing in…" : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            New here? <Link to="/affiliate-pricing" className="text-primary font-semibold hover:underline">Join Affilyt</Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">Built by <span className="text-foreground font-medium">Prime Haven</span></p>
      </motion.div>
    </div>
  );
};

export default Login;
