import { useState, useMemo } from "react";
import { Image, FileText, Video, Download, Copy, Check, Search, Eye, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ResourceType = "banner" | "copy" | "video";

interface Resource {
    id: string; type: ResourceType; title: string; product: string; description: string;
    previewUrl?: string; content?: string; fileSize?: string; dimensions?: string;
}

const mockResources: Resource[] = [
    { id: "r1", type: "banner", title: "Summer Sale Banner - 1200x628", product: "Digital Marketing Course", description: "Facebook/Instagram feed ad banner", previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=314&fit=crop", fileSize: "245 KB", dimensions: "1200×628" },
    { id: "r2", type: "banner", title: "Story Banner - 1080x1920", product: "Digital Marketing Course", description: "Instagram/TikTok story format", previewUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=270&h=480&fit=crop", fileSize: "312 KB", dimensions: "1080×1920" },
    { id: "r3", type: "banner", title: "Website Banner - 728x90", product: "Fitness Tracker Pro", description: "Leaderboard website ad", previewUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=728&h=90&fit=crop", fileSize: "89 KB", dimensions: "728×90" },
    { id: "r4", type: "banner", title: "Square Post - 1080x1080", product: "E-Book Bundle", description: "Instagram feed square post", previewUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", fileSize: "198 KB", dimensions: "1080×1080" },
    { id: "r5", type: "copy", title: "Email Blast - Launch Day", product: "Digital Marketing Course", description: "Ready-to-send email for product launch", content: "🚀 LIMITED TIME: Master Digital Marketing for just $97!\n\nHey [Name],\n\nI just found this incredible Digital Marketing course...\n\n✅ Social media mastery\n✅ SEO that actually works\n✅ Email marketing automation\n\n👉 Grab it now: [YOUR LINK]" },
    { id: "r6", type: "copy", title: "WhatsApp Broadcast", product: "E-Book Bundle", description: "WhatsApp message for sharing with contacts", content: "📚 Hey! Quick question — do you read ebooks?\n\nI found this insane deal: 50 premium ebooks for just $29.\n\n🔗 Check it out: [YOUR LINK]\n\nLet me know if you grab it! 🔥" },
    { id: "r7", type: "copy", title: "Instagram Caption", product: "Fitness Tracker Pro", description: "Copy-paste caption for IG post", content: "Tracking my fitness goals has never been easier 🏃‍♂️💪\n\nThis Premium Fitness Tracker does it ALL:\n⌚ Heart rate monitoring\n📊 Sleep tracking\n\nGrab yours 👉 link in bio\n\n#FitnessTracker #HealthTech" },
    { id: "r8", type: "video", title: "Product Demo - 30s", product: "Digital Marketing Course", description: "Short-form video for TikTok/Reels", previewUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=240&fit=crop", fileSize: "8.2 MB" },
    { id: "r9", type: "video", title: "Testimonial Compilation", product: "E-Book Bundle", description: "Customer reviews video", previewUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop", fileSize: "12.5 MB" },
];

const typeConfig: Record<ResourceType, { icon: any; label: string; color: string; bg: string }> = {
    banner: { icon: Image, label: "Banners", color: "text-primary", bg: "bg-primary/10" },
    copy: { icon: FileText, label: "Swipe Copy", color: "text-amber-500", bg: "bg-amber-500/10" },
    video: { icon: Video, label: "Video", color: "text-purple-500", bg: "bg-purple-500/10" },
};

const MarketingResources = () => {
    const { toast } = useToast();
    const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
    const [search, setSearch] = useState("");
    const [previewResource, setPreviewResource] = useState<Resource | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filtered = useMemo(() =>
        mockResources.filter(r =>
            (typeFilter === "all" || r.type === typeFilter) &&
            (search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()))
        ), [typeFilter, search]
    );

    const handleCopy = (resource: Resource) => {
        if (resource.content) {
            navigator.clipboard.writeText(resource.content);
            setCopiedId(resource.id);
            toast({ title: "Copied!", description: `${resource.title} text copied.` });
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Marketing Resources</h2>
                <p className="text-sm text-muted-foreground mt-1">Banners, swipe copy, and video assets for every product.</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} className="h-10 rounded-xl bg-secondary border-none pl-10 text-sm" placeholder="Search resources..." />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setTypeFilter("all")} className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${typeFilter === "all" ? "bg-primary text-primary-foreground" : "glass-subtle hover:border-primary/30"}`}>
                        All ({mockResources.length})
                    </button>
                    {(Object.entries(typeConfig) as [ResourceType, typeof typeConfig["banner"]][]).map(([key, conf]) => (
                        <button key={key} onClick={() => setTypeFilter(key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${typeFilter === key ? "bg-primary text-primary-foreground" : "glass-subtle hover:border-primary/30"}`}>
                            <conf.icon className="h-3.5 w-3.5" />
                            {conf.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map(resource => {
                    const conf = typeConfig[resource.type];
                    const Icon = conf.icon;
                    return (
                        <div key={resource.id} className="group p-4 sm:p-5 rounded-2xl glass hover:border-primary/20 hover:shadow-md transition-all flex flex-col">
                            {resource.previewUrl ? (
                                <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden mb-3 cursor-pointer" onClick={() => setPreviewResource(resource)}>
                                    <img src={resource.previewUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="h-6 w-6 text-white" /></div>
                                    {resource.type === "video" && <Badge className="absolute bottom-2 left-2 bg-black/60 text-white border-none text-[9px]">▶ VIDEO</Badge>}
                                </div>
                            ) : resource.content ? (
                                <div className="h-32 rounded-xl bg-secondary/50 border border-border p-3 overflow-hidden mb-3 relative">
                                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{resource.content.slice(0, 180)}...</p>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-secondary to-transparent" />
                                </div>
                            ) : null}

                            <div className="flex gap-1.5 mb-2">
                                <Badge className={`${conf.bg} ${conf.color} border-none text-[9px]`}><Icon className="h-3 w-3 mr-1" /> {conf.label}</Badge>
                                {resource.dimensions && <Badge variant="secondary" className="text-[9px]">{resource.dimensions}</Badge>}
                            </div>

                            <h3 className="font-semibold text-sm text-foreground mb-0.5 leading-snug">{resource.title}</h3>
                            <p className="text-xs text-muted-foreground mb-1 flex-1">{resource.description}</p>
                            <p className="text-[10px] text-primary font-medium mb-3">{resource.product}</p>

                            <div className="flex gap-2">
                                {resource.type === "copy" ? (
                                    <Button onClick={() => handleCopy(resource)} size="sm" className="flex-1 h-9 rounded-xl text-xs font-medium">
                                        {copiedId === resource.id ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy</>}
                                    </Button>
                                ) : (
                                    <Button size="sm" className="flex-1 h-9 rounded-xl text-xs font-medium" onClick={() => toast({ title: "Download Started", description: `Downloading ${resource.title}` })}>
                                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                                    </Button>
                                )}
                                {resource.previewUrl && (
                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPreviewResource(resource)}><Eye className="h-3.5 w-3.5" /></Button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-span-full p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center">
                        <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No resources match your filters.</p>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewResource(null)}>
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <Button size="icon" variant="secondary" className="absolute -top-3 -right-3 h-8 w-8 rounded-full z-10" onClick={() => setPreviewResource(null)}><X className="h-4 w-4" /></Button>
                        <div className="rounded-2xl overflow-hidden glass shadow-2xl">
                            {previewResource.previewUrl && <img src={previewResource.previewUrl} alt={previewResource.title} className="w-full max-h-[60vh] object-contain bg-black" />}
                            <div className="p-4">
                                <h3 className="font-semibold text-foreground">{previewResource.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{previewResource.product} • {previewResource.fileSize}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketingResources;
