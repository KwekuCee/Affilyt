import { useState } from "react";
import {
    Link2, Copy, Calendar, Tag, Globe, Sparkles, Check, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const SmartLinkCustomizer = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "abc123";
    const baseUrl = window.location.origin;

    const [slug, setSlug] = useState(refId);
    const [utm, setUtm] = useState({ source: "", medium: "", campaign: "", content: "" });
    const [expiry, setExpiry] = useState("");
    const [copied, setCopied] = useState(false);

    const buildUrl = () => {
        let url = `${baseUrl}/marketplace?ref=${slug}`;
        const params: string[] = [];
        if (utm.source) params.push(`utm_source=${encodeURIComponent(utm.source)}`);
        if (utm.medium) params.push(`utm_medium=${encodeURIComponent(utm.medium)}`);
        if (utm.campaign) params.push(`utm_campaign=${encodeURIComponent(utm.campaign)}`);
        if (utm.content) params.push(`utm_content=${encodeURIComponent(utm.content)}`);
        if (params.length) url += `&${params.join("&")}`;
        return url;
    };

    const copy = () => {
        navigator.clipboard.writeText(buildUrl());
        setCopied(true);
        toast({ title: "Link copied!", description: "Your custom smart link is ready to share." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Smart Links</h2>
                <p className="text-muted-foreground font-medium">Customize slugs, add UTM tracking, and set expiration dates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Custom Slug */}
                <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <Link2 className="h-20 w-20 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <Badge className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full italic">CUSTOM SLUG</Badge>
                        <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Your Unique Handle</h3>
                        <p className="text-sm text-muted-foreground font-medium">Create a memorable, branded slug for your affiliate link.</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Slug / Handle</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{baseUrl}/marketplace?ref=</span>
                                <Input
                                    value={slug}
                                    onChange={e => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24))}
                                    className="h-14 rounded-2xl bg-secondary border-none font-black"
                                    placeholder="your-slug"
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground font-bold italic">Letters, numbers, dashes, underscores only. Max 24 chars.</p>
                        </div>
                    </div>
                </div>

                {/* Link Expiration */}
                <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <Clock className="h-20 w-20 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <Badge className="bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full italic">EXPIRY</Badge>
                        <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Link Expiration</h3>
                        <p className="text-sm text-muted-foreground font-medium">Set an optional expiration date for time-limited campaigns.</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Expires On</label>
                            <Input
                                type="date"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                className="h-14 rounded-2xl bg-secondary border-none font-bold"
                            />
                        </div>
                        {expiry && (
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs font-bold text-amber-500">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    Link expires on {new Date(expiry).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* UTM Parameters */}
            <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-border shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">UTM Parameters</h3>
                        <p className="text-xs text-muted-foreground font-medium">Track which campaigns and platforms drive the most conversions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {([
                        { key: "source", label: "UTM Source", placeholder: "e.g. instagram, tiktok, whatsapp", icon: Globe },
                        { key: "medium", label: "UTM Medium", placeholder: "e.g. social, email, sms", icon: Sparkles },
                        { key: "campaign", label: "UTM Campaign", placeholder: "e.g. summer-sale, launch-day", icon: Tag },
                        { key: "content", label: "UTM Content", placeholder: "e.g. bio-link, story-ad", icon: Tag },
                    ] as const).map(field => (
                        <div key={field.key} className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <field.icon className="h-3 w-3" /> {field.label}
                            </label>
                            <Input
                                value={utm[field.key as keyof typeof utm]}
                                onChange={e => setUtm({ ...utm, [field.key]: e.target.value })}
                                className="h-14 rounded-2xl bg-secondary border-none font-bold"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Preview */}
            <div className="p-10 rounded-[3rem] bg-primary/5 border-2 border-primary/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Live Preview</h3>
                    <Badge className="bg-success/20 text-success text-[10px] font-black uppercase px-4 py-1 rounded-full italic border-none">READY</Badge>
                </div>

                <div className="p-6 rounded-2xl bg-secondary/50 border border-border overflow-x-auto">
                    <code className="text-xs font-bold text-primary break-all">{buildUrl()}</code>
                </div>

                <div className="flex gap-4">
                    <Button onClick={copy} className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20">
                        {copied ? <><Check className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Smart Link</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SmartLinkCustomizer;
