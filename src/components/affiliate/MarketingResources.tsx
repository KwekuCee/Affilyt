import { useState, useMemo } from "react";
import {
    Image, FileText, Video, Download, Copy, Check,
    Search, Filter, Eye, X, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ResourceType = "banner" | "copy" | "video";

interface Resource {
    id: string;
    type: ResourceType;
    title: string;
    product: string;
    description: string;
    previewUrl?: string;
    content?: string;
    fileSize?: string;
    dimensions?: string;
}

const mockResources: Resource[] = [
    // Banners
    { id: "r1", type: "banner", title: "Summer Sale Banner - 1200x628", product: "Digital Marketing Course", description: "Facebook/Instagram feed ad banner", previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=314&fit=crop", fileSize: "245 KB", dimensions: "1200×628" },
    { id: "r2", type: "banner", title: "Story Banner - 1080x1920", product: "Digital Marketing Course", description: "Instagram/TikTok story format", previewUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=270&h=480&fit=crop", fileSize: "312 KB", dimensions: "1080×1920" },
    { id: "r3", type: "banner", title: "Website Banner - 728x90", product: "Fitness Tracker Pro", description: "Leaderboard website ad", previewUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=728&h=90&fit=crop", fileSize: "89 KB", dimensions: "728×90" },
    { id: "r4", type: "banner", title: "Square Post - 1080x1080", product: "E-Book Bundle", description: "Instagram feed square post", previewUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", fileSize: "198 KB", dimensions: "1080×1080" },
    // Swipe Copy
    { id: "r5", type: "copy", title: "Email Blast - Launch Day", product: "Digital Marketing Course", description: "Ready-to-send email for product launch", content: "🚀 LIMITED TIME: Master Digital Marketing for just $97!\n\nHey [Name],\n\nI just found this incredible Digital Marketing course that's changing the game. For a limited time, you can get lifetime access for only $97 (normally $297).\n\nHere's what you'll learn:\n✅ Social media mastery\n✅ SEO that actually works\n✅ Email marketing automation\n✅ Paid ads on a budget\n\n👉 Grab it now: [YOUR LINK]\n\nThis offer won't last. The price goes up at midnight!\n\nBest,\n[Your Name]" },
    { id: "r6", type: "copy", title: "WhatsApp Broadcast", product: "E-Book Bundle", description: "WhatsApp message for sharing with contacts", content: "📚 Hey! Quick question — do you read ebooks?\n\nI found this insane deal: 50 premium ebooks for just $29. That's less than $0.60 per book!\n\nTopics include business, self-help, finance, health & more.\n\n🔗 Check it out: [YOUR LINK]\n\nLet me know if you grab it! 🔥" },
    { id: "r7", type: "copy", title: "Instagram Caption", product: "Fitness Tracker Pro", description: "Copy-paste caption for IG post", content: "Tracking my fitness goals has never been easier 🏃‍♂️💪\n\nThis Premium Fitness Tracker does it ALL:\n⌚ Heart rate monitoring\n📊 Sleep tracking\n🏋️ Workout analytics\n📱 Smart notifications\n\nAND it looks 🔥 on my wrist.\n\nGrab yours 👉 link in bio\n\n#FitnessTracker #HealthTech #FitnessGoals #Wellness #TechReview" },
    // Video Assets
    { id: "r8", type: "video", title: "Product Demo - 30s", product: "Digital Marketing Course", description: "Short-form video for TikTok/Reels", previewUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=240&fit=crop", fileSize: "8.2 MB" },
    { id: "r9", type: "video", title: "Testimonial Compilation", product: "E-Book Bundle", description: "Customer reviews video for social proof", previewUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop", fileSize: "12.5 MB" },
    { id: "r10", type: "video", title: "Unboxing Video", product: "Fitness Tracker Pro", description: "Unboxing reel for TikTok/YouTube", previewUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=240&fit=crop", fileSize: "15.1 MB" },
];

const typeConfig: Record<ResourceType, { icon: any; label: string; color: string; bg: string }> = {
    banner: { icon: Image, label: "Banners", color: "text-primary", bg: "bg-primary/10" },
    copy: { icon: FileText, label: "Swipe Copy", color: "text-amber-500", bg: "bg-amber-500/10" },
    video: { icon: Video, label: "Video Assets", color: "text-purple-500", bg: "bg-purple-500/10" },
};

const MarketingResources = () => {
    const { toast } = useToast();
    const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
    const [productFilter, setProductFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const products = useMemo(() => {
        const set = new Set(mockResources.map(r => r.product));
        return Array.from(set);
    }, []);

    const filtered = useMemo(() =>
        mockResources.filter(r =>
            (typeFilter === "all" || r.type === typeFilter) &&
            (productFilter === "all" || r.product === productFilter) &&
            (search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()))
        ),
        [typeFilter, productFilter, search]
    );

    const handleCopy = (resource: Resource) => {
        if (resource.content) {
            navigator.clipboard.writeText(resource.content);
            setCopiedId(resource.id);
            toast({ title: "Copied!", description: `${resource.title} text copied to clipboard.` });
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const handleDownload = (resource: Resource) => {
        toast({ title: "Download Started", description: `Downloading ${resource.title}...` });
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Marketing Arsenal</h2>
                    <p className="text-muted-foreground font-medium">Banners, swipe copy, and video assets for every product.</p>
                </div>
                <FolderOpen className="h-10 w-10 text-primary" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search resources..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-14 rounded-2xl bg-secondary border-none font-bold pl-12"
                    />
                </div>
                <select
                    value={productFilter}
                    onChange={e => setProductFilter(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary border-none font-bold px-6 text-foreground"
                >
                    <option value="all">All Products</option>
                    {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {/* Type Tabs */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => setTypeFilter("all")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${typeFilter === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                        }`}
                >
                    All ({mockResources.length})
                </button>
                {(Object.entries(typeConfig) as [ResourceType, typeof typeConfig["banner"]][]).map(([key, conf]) => (
                    <button
                        key={key}
                        onClick={() => setTypeFilter(key)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${typeFilter === key ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                            }`}
                    >
                        <conf.icon className="h-4 w-4" />
                        {conf.label} ({mockResources.filter(r => r.type === key).length})
                    </button>
                ))}
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(resource => {
                    const conf = typeConfig[resource.type];
                    const Icon = conf.icon;
                    return (
                        <div key={resource.id} className="group p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500 flex flex-col">
                            {/* Preview / Content Area */}
                            {resource.previewUrl ? (
                                <div className="relative h-40 rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => setPreviewResource(resource)}>
                                    <img src={resource.previewUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye className="h-8 w-8 text-white" />
                                    </div>
                                    {resource.type === "video" && (
                                        <div className="absolute bottom-3 left-3">
                                            <Badge className="bg-black/60 text-white border-none text-[9px] font-black backdrop-blur-sm">▶ VIDEO</Badge>
                                        </div>
                                    )}
                                </div>
                            ) : resource.content ? (
                                <div className="h-40 rounded-2xl bg-secondary/50 border border-border p-4 overflow-hidden mb-4 relative">
                                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{resource.content.slice(0, 200)}...</p>
                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary/80 to-transparent" />
                                </div>
                            ) : null}

                            <div className="flex gap-2 mb-2">
                                <Badge className={`${conf.bg} ${conf.color} border-none text-[9px] font-black`}>
                                    <Icon className="h-3 w-3 mr-1" /> {conf.label}
                                </Badge>
                                {resource.dimensions && (
                                    <Badge className="bg-secondary text-muted-foreground border-none text-[9px] font-black">{resource.dimensions}</Badge>
                                )}
                            </div>

                            <h3 className="font-black text-foreground mb-1">{resource.title}</h3>
                            <p className="text-xs text-muted-foreground font-medium mb-1 flex-1">{resource.description}</p>
                            <p className="text-[10px] text-primary font-bold mb-4">{resource.product}</p>

                            <div className="flex gap-3">
                                {resource.type === "copy" ? (
                                    <Button onClick={() => handleCopy(resource)} className="flex-1 h-11 rounded-xl font-black text-xs uppercase">
                                        {copiedId === resource.id ? <><Check className="h-4 w-4 mr-1" /> Copied</> : <><Copy className="h-4 w-4 mr-1" /> Copy Text</>}
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleDownload(resource)} className="flex-1 h-11 rounded-xl font-black text-xs uppercase">
                                        <Download className="h-4 w-4 mr-1" /> Download
                                    </Button>
                                )}
                                {resource.previewUrl && (
                                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={() => setPreviewResource(resource)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="col-span-3 p-16 rounded-[2rem] bg-card/30 border-2 border-dashed border-border text-center">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                        <p className="text-muted-foreground font-bold italic">No resources match your filters.</p>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setPreviewResource(null)}>
                    <div className="relative max-w-3xl w-full mx-6" onClick={e => e.stopPropagation()}>
                        <Button size="icon" variant="secondary" className="absolute -top-4 -right-4 h-10 w-10 rounded-full z-10" onClick={() => setPreviewResource(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                        <div className="rounded-[2rem] overflow-hidden bg-card border-2 border-border shadow-2xl">
                            {previewResource.previewUrl && (
                                <img src={previewResource.previewUrl} alt={previewResource.title} className="w-full max-h-[60vh] object-contain bg-black" />
                            )}
                            <div className="p-6">
                                <h3 className="font-black text-lg text-foreground">{previewResource.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{previewResource.product} • {previewResource.fileSize}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketingResources;
