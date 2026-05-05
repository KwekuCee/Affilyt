import { motion } from "framer-motion";
import { Mail, Send, MessageSquare, Phone, Globe, Shield } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  topic: z.string().min(1, "Pick a topic"),
  message: z.string().trim().min(5, "Tell us a bit more").max(2000),
});

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", topic: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your inputs", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert([parsed.data as Required<typeof parsed.data>]);
    setSending(false);
    if (error) return toast({ title: "Could not send", description: error.message, variant: "destructive" });
    toast({ title: "Message sent", description: "We'll respond within 24 hours." });
    setForm({ full_name: "", email: "", topic: "", message: "" });
  };

  const methods = [
    { icon: Mail, title: "Email", value: "support@affilyt.site", href: "mailto:support@affilyt.site" },
    { icon: Phone, title: "Phone", value: "Coming soon", href: "#" },
    { icon: MessageSquare, title: "WhatsApp", value: "Coming soon", href: "#" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNavbar />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">Contact</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">Talk to us.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Questions, partnerships, support — we typically reply within 24 hours.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3">
              {methods.map((m) => (
                <a key={m.title} href={m.href} className="flex items-center gap-4 p-5 rounded-lg glass hover:border-primary/40 hover:shadow-elevated transition-all group">
                  <div className="h-11 w-11 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.title}</p>
                    <p className="font-medium">{m.value}</p>
                  </div>
                </a>
              ))}

              <div className="mt-6 p-6 rounded-xl gradient-hero text-white relative overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="relative">
                  <Globe className="h-6 w-6 mb-3" />
                  <h4 className="font-display text-xl font-semibold mb-2">Global presence</h4>
                  <p className="text-white/70 text-sm mb-4">Operating across:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Ghana", "Nigeria", "USA", "London"].map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={submit} className="glass rounded-xl p-8 shadow-elevated space-y-5">
                <div>
                  <h3 className="font-display text-2xl font-bold mb-1">Send a message</h3>
                  <p className="text-sm text-muted-foreground">Fill in the form and we'll be in touch.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Topic</Label>
                  <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General inquiry</SelectItem>
                      <SelectItem value="affiliate">Affiliate program</SelectItem>
                      <SelectItem value="seller">Seller program</SelectItem>
                      <SelectItem value="support">Technical support</SelectItem>
                      <SelectItem value="billing">Billing & payouts</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Message</Label>
                  <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" required />
                </div>
                <Button type="submit" disabled={sending} className="w-full gap-2 shadow-glow">
                  {sending ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
                </Button>
                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" /> Encrypted in transit
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
