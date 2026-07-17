import { useEffect, useMemo, useState } from "react";
import { Image as ImgIcon, FileText, Video, Download, Copy, Check, Search, Eye, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ResourceType = "banner" | "copy" | "video" | string;

interface Resource {
  id: string; type: ResourceType | null; title: string; description: string | null;
  file_url: string | null; content: string | null; file_size: string | null; dimensions: string | null;
  preview_url: string | null; category: string | null;
}

const typeConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  banner: { icon: ImgIcon, label: "Banners", color: "text-primary", bg: "bg-primary/10" },
  copy: { icon: FileText, label: "Swipe Copy", color: "text-amber-500", bg: "bg-amber-500/10" },
  video: { icon: Video, label: "Video", color: "text-purple-500", bg: "bg-purple-500/10" },
  other: { icon: FileText, label: "Other", color: "text-muted-foreground", bg: "bg-secondary" },
};

const MarketingResources = () => {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<Resource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      setItems((data as any) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() =>
    items.filter(r =>
      (typeFilter === "all" || (r.type || "other") === typeFilter) &&
      (search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase()))
    ), [items, typeFilter, search]);

  const handleCopy = (r: Resource) => {
    if (!r.content) return;
    navigator.clipboard.writeText(r.content);
    setCopiedId(r.id);
    toast.success(`${r.title} copied`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (r: Resource) => {
    if (!r.file_url) return toast.error("No file attached");
    try {
      const res = await fetch(r.file_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.title.replace(/[^a-z0-9]/gi, "_");
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(r.file_url, "_blank");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Marketing Resources</h2>
        <p className="text-sm text-muted-foreground mt-1">Banners, swipe copy, and video assets uploaded by admins.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} className="h-10 rounded-xl bg-secondary border-none pl-10 text-sm" placeholder="Search resources..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTypeFilter("all")} className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${typeFilter === "all" ? "bg-primary text-primary-foreground" : "glass-subtle"}`}>All ({items.length})</button>
          {["banner", "copy", "video"].map(key => {
            const conf = typeConfig[key];
            return (
              <button key={key} onClick={() => setTypeFilter(key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${typeFilter === key ? "bg-primary text-primary-foreground" : "glass-subtle"}`}>
                <conf.icon className="h-3.5 w-3.5" /> {conf.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl glass text-center text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center">
          <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-sm text-muted-foreground">No resources available yet. Admins can add them from the admin dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map(r => {
            const conf = typeConfig[r.type || "other"] || typeConfig.other;
            const Icon = conf.icon;
            return (
              <div key={r.id} className="group p-4 sm:p-5 rounded-2xl glass hover:border-primary/20 hover:shadow-md transition-all flex flex-col">
                {r.preview_url || r.file_url ? (
                  <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden mb-3 cursor-pointer bg-secondary/40" onClick={() => setPreview(r)}>
                    {(r.preview_url || r.file_url) && <img src={r.preview_url || r.file_url!} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="h-6 w-6 text-white" /></div>
                    {r.type === "video" && <Badge className="absolute bottom-2 left-2 bg-black/60 text-white border-none text-[9px]">▶ VIDEO</Badge>}
                  </div>
                ) : r.content ? (
                  <div className="h-32 rounded-xl bg-secondary/50 border border-border p-3 overflow-hidden mb-3 relative">
                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{r.content.slice(0, 180)}...</p>
                  </div>
                ) : null}

                <div className="flex gap-1.5 mb-2">
                  <Badge className={`${conf.bg} ${conf.color} border-none text-[9px]`}><Icon className="h-3 w-3 mr-1" /> {conf.label}</Badge>
                  {r.dimensions && <Badge variant="secondary" className="text-[9px]">{r.dimensions}</Badge>}
                </div>

                <h3 className="font-semibold text-sm text-foreground mb-0.5 leading-snug">{r.title}</h3>
                {r.description && <p className="text-xs text-muted-foreground mb-3 flex-1">{r.description}</p>}

                <div className="flex gap-2 mt-auto">
                  {r.type === "copy" && r.content ? (
                    <Button onClick={() => handleCopy(r)} size="sm" className="flex-1 h-9 rounded-xl text-xs font-medium">
                      {copiedId === r.id ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy</>}
                    </Button>
                  ) : r.file_url ? (
                    <Button size="sm" className="flex-1 h-9 rounded-xl text-xs font-medium" onClick={() => handleDownload(r)}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                  ) : null}
                  {(r.preview_url || r.file_url) && (
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPreview(r)}><Eye className="h-3.5 w-3.5" /></Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <Button size="icon" variant="secondary" className="absolute -top-3 -right-3 h-8 w-8 rounded-full z-10" onClick={() => setPreview(null)}><X className="h-4 w-4" /></Button>
            <div className="rounded-2xl overflow-hidden glass shadow-2xl">
              {preview.type === "video" && preview.file_url ? (
                <video src={preview.file_url} controls className="w-full max-h-[70vh] bg-black" />
              ) : (preview.preview_url || preview.file_url) ? (
                <img src={preview.preview_url || preview.file_url!} alt={preview.title} className="w-full max-h-[70vh] object-contain bg-black" />
              ) : preview.content ? (
                <pre className="p-6 whitespace-pre-wrap text-sm bg-card max-h-[70vh] overflow-auto">{preview.content}</pre>
              ) : null}
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{preview.title}</h3>
                {preview.description && <p className="text-xs text-muted-foreground mt-1">{preview.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingResources;
