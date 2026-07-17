import { useEffect, useState } from "react";
import { Link2, Copy, Tag, Sparkles, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface LinkRow { id: string; short_code: string; product_id: string; products?: { title: string } | null }

const SmartLinkCustomizer = () => {
  const { user, profile } = useAuth();
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [selected, setSelected] = useState<LinkRow | null>(null);
  const [customSlug, setCustomSlug] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("affiliate_links").select("id, short_code, product_id, products(title)").eq("affiliate_id", user.id).order("created_at", { ascending: false });
      const rows = (data as any) || [];
      setLinks(rows);
      if (rows[0]) setSelected(rows[0]);
    })();
  }, [user]);

  const buildLink = () => {
    if (!selected) return "";
    const base = window.location.origin;
    const slug = customSlug || selected.short_code;
    const params = new URLSearchParams();
    params.set("ref", slug);
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    if (utmContent) params.set("utm_content", utmContent);
    return `${base}/product/${selected.product_id}?${params.toString()}`;
  };

  const smartLink = buildLink();
  const expiryDate = expiresIn ? new Date(Date.now() + parseInt(expiresIn) * 86400000).toLocaleDateString() : null;

  const handleCopy = () => {
    if (!smartLink) return;
    navigator.clipboard.writeText(smartLink);
    setCopied(true);
    toast.success("Smart link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Smart Links</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize slugs and UTM parameters on your real product links.</p>
      </div>

      {links.length === 0 ? (
        <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center text-sm text-muted-foreground">
          You don't have any affiliate links yet. Head to Inventory and create one for a product.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Select Link</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-auto pr-1">
                {links.map(link => (
                  <button key={link.id} onClick={() => setSelected(link)} className={`text-left p-3 rounded-xl border transition-all ${selected?.id === link.id ? "bg-primary/10 border-primary/30" : "bg-secondary/30 border-transparent hover:border-border"}`}>
                    <p className="font-semibold text-sm text-foreground truncate">{link.products?.title || "Product"}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/{link.short_code}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
              <div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /><h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Custom Slug</h3></div>
              <Input value={customSlug} onChange={e => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))} className="h-10 rounded-lg bg-secondary border-none text-sm" placeholder={selected?.short_code || ""} />
            </div>

            <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
              <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /><h3 className="text-xs font-semibold uppercase tracking-wider text-primary">UTM Parameters</h3></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Source", value: utmSource, set: setUtmSource, placeholder: "instagram, tiktok, youtube" },
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

            <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Expiration</h3></div>
              <div className="flex flex-wrap gap-2">
                {[{ label: "No expiry", value: "" }, { label: "7 days", value: "7" }, { label: "30 days", value: "30" }, { label: "90 days", value: "90" }].map(opt => (
                  <button key={opt.value} onClick={() => setExpiresIn(opt.value)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${expiresIn === opt.value ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>{opt.label}</button>
                ))}
              </div>
              {expiryDate && <p className="text-xs text-muted-foreground">Expires on <span className="font-semibold text-foreground">{expiryDate}</span></p>}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 sticky top-4">
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Link Preview</h3></div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border break-all">
                <p className="text-xs font-mono text-foreground leading-relaxed">{smartLink}</p>
              </div>
              <Button onClick={handleCopy} className="w-full h-10 rounded-xl font-semibold text-sm">
                {copied ? <><Check className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Link</>}
              </Button>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selected?.products?.title && <Badge variant="secondary" className="text-[10px]">{selected.products.title}</Badge>}
                {utmSource && <Badge variant="outline" className="text-[10px]">src: {utmSource}</Badge>}
                {utmMedium && <Badge variant="outline" className="text-[10px]">med: {utmMedium}</Badge>}
                {utmCampaign && <Badge variant="outline" className="text-[10px]">camp: {utmCampaign}</Badge>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLinkCustomizer;
