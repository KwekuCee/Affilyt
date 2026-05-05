import { useState } from "react";
import {
    Link2, Copy, Calendar, Tag, Globe, Sparkles, Check, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const existingLinks = [
    { id: "l1", product: "Digital Marketing Mastery", shortCode: "abc123", url: "/marketplace?ref=abc123" },
    { id: "l2", product: "Premium Fitness Tracker", shortCode: "fit456", url: "/marketplace?ref=fit456" },
    { id: "l3", product: "E-Book Bundle: 50 Titles", shortCode: "book789", url: "/marketplace?ref=book789" },
    { id: "l4", product: "Wireless Headphones Pro", shortCode: "head101", url: "/marketplace?ref=head101" },
];

const SmartLinkCustomizer = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [selectedLink, setSelectedLink] = useState(existingLinks[0]);
    const [customSlug, setCustomSlug] = useState("");
    const [utmSource, setUtmSource] = useState("");
    const [utmMedium, setUtmMedium] = useState("");
    const [utmCampaign, setUtmCampaign] = useState("");
    const [utmContent, setUtmContent] = useState("");
    const [expiresIn, setExpiresIn] = useState<string>("");
    const [copied, setCopied] = useState(false);

    // Build the smart link
    const buildLink = () => {
        const base = window.location.origin;
        const slug = customSlug || selectedLink.shortCode;
        const params = new URLSearchParams();
        const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
        params.set("ref", refId);
        if (utmSource) params.set("utm_source", utmSource);
        if (utmMedium) params.set("utm_medium", utmMedium);
        if (utmCampaign) params.set("utm_campaign", utmCampaign);
        if (utmContent) params.set("utm_content", utmContent);
        return `${base}/go/${slug}?${params.toString()}`;
    };

    const smartLink = buildLink();

    const handleCopy = () => {
        navigator.clipboard.writeText(smartLink);
        setCopied(true);
        toast({ title: "Link Copied!", description: "Smart link copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    const expiryDate = expiresIn
        ? new Date(Date.now() + parseInt(expiresIn) * 86400000).toLocaleDateString()
        : null;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Smart Links</h2>
                <p className="text-sm text-muted-foreground mt-1">Customize slugs, UTM parameters, and link expiration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Config Panel */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Select Base Link */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Select Link</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {existingLinks.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => setSelectedLink(link)}
                                    className={`text-left p-3 rounded-xl border transition-all ${selectedLink.id === link.id
                                        ? "bg-primary/10 border-primary/30 shadow-sm"
                                        : "bg-secondary/30 border-transparent hover:border-border"
                                        }`}
                                >
                                    <p className="font-semibold text-sm text-foreground truncate">{link.product}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/{link.shortCode}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Slug */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
                        <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Custom Slug</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">{window.location.origin}/go/</span>
                            <Input
                                value={customSlug}
                                onChange={e => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                                className="h-10 rounded-lg bg-secondary border-none font-medium text-sm"
                                placeholder={selectedLink.shortCode}
                            />
                        </div>
                    </div>

                    {/* UTM Parameters */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">UTM Parameters</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { label: "Source", value: utmSource, set: setUtmSource, placeholder: "instagram" },
                                { label: "Medium", value: utmMedium, set: setUtmMedium, placeholder: "social" },
                                { label: "Campaign", value: utmCampaign, set: setUtmCampaign, placeholder: "summer_sale" },
                                { label: "Content", value: utmContent, set: setUtmContent, placeholder: "bio_link" },
                            ].map(f => (
                                <div key={f.label} className="space-y-1.5">
                                    <label className="text-[11px] font-medium uppercase text-muted-foreground tracking-wider">{f.label}</label>
                                    <Input value={f.value} onChange={e => f.set(e.target.value)} className="h-10 rounded-lg bg-secondary border-none text-sm" placeholder={f.placeholder} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expiration */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Expiration</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "No expiry", value: "" },
                                { label: "7 days", value: "7" },
                                { label: "30 days", value: "30" },
                                { label: "90 days", value: "90" },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setExpiresIn(opt.value)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${expiresIn === opt.value
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {expiryDate && (
                            <p className="text-xs text-muted-foreground">Expires on <span className="font-semibold text-foreground">{expiryDate}</span></p>
                        )}
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 sticky top-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Link Preview</h3>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50 border border-border break-all">
                            <p className="text-xs font-mono text-foreground leading-relaxed">{smartLink}</p>
                        </div>

                        <Button onClick={handleCopy} className="w-full h-10 rounded-xl font-semibold text-sm">
                            {copied ? <><Check className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Link</>}
                        </Button>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            <Badge variant="secondary" className="text-[10px] font-medium">{selectedLink.product}</Badge>
                            {utmSource && <Badge variant="outline" className="text-[10px]">src: {utmSource}</Badge>}
                            {utmMedium && <Badge variant="outline" className="text-[10px]">med: {utmMedium}</Badge>}
                            {utmCampaign && <Badge variant="outline" className="text-[10px]">camp: {utmCampaign}</Badge>}
                            {expiresIn && <Badge variant="outline" className="text-[10px]">expires: {expiresIn}d</Badge>}
                        </div>

                        {/* Params Breakdown */}
                        <div className="space-y-2 pt-2 border-t border-border">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Breakdown</p>
                            {[
                                { label: "Base", value: `${window.location.origin}/go/${customSlug || selectedLink.shortCode}` },
                                { label: "Ref ID", value: profile?.affiliate_link || user?.id?.slice(0, 8) || "demo" },
                                ...(utmSource ? [{ label: "utm_source", value: utmSource }] : []),
                                ...(utmMedium ? [{ label: "utm_medium", value: utmMedium }] : []),
                                ...(utmCampaign ? [{ label: "utm_campaign", value: utmCampaign }] : []),
                                ...(utmContent ? [{ label: "utm_content", value: utmContent }] : []),
                            ].map(p => (
                                <div key={p.label} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{p.label}</span>
                                    <span className="font-mono text-foreground truncate ml-2 max-w-[180px]">{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartLinkCustomizer;
