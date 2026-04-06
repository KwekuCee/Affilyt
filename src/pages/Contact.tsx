import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, Send, Globe, Shield } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    const contactMethods = [
        { icon: Mail, title: "Email Us", value: "support@affilyt.site", link: "mailto:support@affilyt.site", color: "bg-blue-500/10 text-blue-500" },
        { icon: Phone, title: "Call Us", value: "Coming soon", link: "#", color: "bg-emerald-500/10 text-emerald-500" },
        { icon: MessageSquare, title: "WhatsApp", value: "Coming soon", link: "#", color: "bg-green-500/10 text-green-500" },
    ];

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <LandingNavbar />

            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">Contact Us</Badge>
                            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-foreground mb-6">
                                Get in Touch with <span className="text-primary italic">Affilyt.</span>
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                Have a question or need support? Our team is available to help you succeed.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-background px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-5 space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {contactMethods.map((method, i) => (
                                    <motion.a key={method.title} href={method.link} target="_blank" rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-6 p-6 rounded-[2rem] border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                                        <div className={`h-16 w-16 rounded-2xl ${method.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <method.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{method.title}</p>
                                            <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{method.value}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>

                            <div className="p-10 rounded-[3rem] bg-foreground text-background relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Globe className="h-24 w-24" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black mb-4">Our Presence.</h4>
                                    <p className="text-background/60 text-sm leading-relaxed mb-8">
                                        Serving affiliate partners across the globe with zero latency.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        {["Ghana", "Nigeria", "USA", "London"].map(city => (
                                            <span key={city} className="px-3 py-1 rounded-full bg-background/10 text-[10px] font-bold uppercase tracking-widest text-background/80">
                                                {city}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                                className="p-8 md:p-12 rounded-[3.5rem] bg-card border-2 border-border shadow-2xl">
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-foreground mb-4 italic">Send a Message.</h3>
                                    <p className="text-muted-foreground">Complete the form and we'll respond within 24 hours.</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                            <Input placeholder="John Doe" className="h-14 rounded-2xl bg-secondary/50 border-none font-medium" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                            <Input type="email" placeholder="you@email.com" className="h-14 rounded-2xl bg-secondary/50 border-none font-medium" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Topic</label>
                                        <Select required>
                                            <SelectTrigger className="h-14 rounded-2xl bg-secondary/50 border-none font-medium">
                                                <SelectValue placeholder="Select a topic" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-border bg-card">
                                                <SelectItem value="general" className="font-medium p-3">General Inquiry</SelectItem>
                                                <SelectItem value="affiliate" className="font-medium p-3">Becoming an Affiliate</SelectItem>
                                                <SelectItem value="support" className="font-medium p-3">Technical Support</SelectItem>
                                                <SelectItem value="billing" className="font-medium p-3">Billing & Payouts</SelectItem>
                                                <SelectItem value="other" className="font-medium p-3">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                                        <Textarea placeholder="How can we help you?" className="min-h-[160px] rounded-[2rem] bg-secondary/50 border-none font-medium p-6 resize-none" required />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl font-black text-xl group shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.3s]" />
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:-0.15s]" />
                                                <div className="h-2 w-2 rounded-full bg-background animate-bounce" />
                                            </div>
                                        ) : (
                                            <>Send Message <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                        )}
                                    </Button>
                                </form>
                                <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-4">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure & Encrypted</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
