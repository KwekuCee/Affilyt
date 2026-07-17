import { useEffect, useState } from "react";
import { Star, LinkIcon, Copy, Check, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TopProduct {
  id: string; title: string; image_url: string | null; price: number; commission_rate: number;
  earnings: number; sales: number; clicks: number; shortCode: string;
}

const TopProductsCarousel = () => {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<TopProduct[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: links } = await supabase.from("affiliate_links").select("id, product_id, short_code, clicks, products(id, title, price, commission_rate, image_url)").eq("affiliate_id", user.id);
      const { data: orders } = await supabase.from("orders").select("product_id, amount, affiliate_link_id").eq("affiliate_id", user.id).eq("status", "completed");
      const byLink: Record<string, { earnings: number; sales: number }> = {};
      (orders || []).forEach((o: any) => {
        const k = o.affiliate_link_id;
        if (!k) return;
        if (!byLink[k]) byLink[k] = { earnings: 0, sales: 0 };
        byLink[k].earnings += Number(o.amount || 0);
        byLink[k].sales += 1;
      });
      const arr: TopProduct[] = (links || []).filter((l: any) => l.products).map((l: any) => ({
        id: l.products.id,
        title: l.products.title,
        image_url: l.products.image_url,
        price: Number(l.products.price),
        commission_rate: Number(l.products.commission_rate),
        clicks: l.clicks || 0,
        shortCode: l.short_code,
        earnings: byLink[l.id]?.earnings || 0,
        sales: byLink[l.id]?.sales || 0,
      }));
      arr.sort((a, b) => b.earnings - a.earnings || b.clicks - a.clicks);
      setItems(arr);
      setLoading(false);
    })();
  }, [user]);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const generateLink = (p: TopProduct) => {
    const link = `${window.location.origin}/product/${p.id}?ref=${p.shortCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(p.id);
    toast.success(`Link copied: ${p.title}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Top Products</h2>
          <p className="text-sm text-muted-foreground mt-1">Your highest-earning products with one-click link copy.</p>
        </div>
        {items.length > itemsPerView && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))} disabled={currentIndex >= maxIndex}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl glass text-center text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center text-sm text-muted-foreground">
          No products yet. Go to Inventory to create your first tracking link.
        </div>
      ) : (
        <>
          <div className="overflow-hidden">
            <div className="flex gap-4 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
              {items.map((p, i) => (
                <div key={p.id} className="shrink-0" style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}>
                  <div className="p-4 sm:p-5 rounded-2xl glass hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                    {i < 3 && (
                      <div className={`absolute top-3 right-3 z-10 h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-slate-300 text-slate-800" : "bg-amber-600 text-amber-100"}`}>#{i + 1}</div>
                    )}
                    {p.image_url && (
                      <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden mb-3">
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-foreground mb-2 leading-snug">{p.title}</h3>
                    <div className="flex gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-[10px]">{p.commission_rate}% rate</Badge>
                      <Badge variant="outline" className="text-[10px]">${p.price.toFixed(2)}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                      <div className="p-2 rounded-lg bg-secondary/50 text-center"><p className="text-sm font-bold">${p.earnings.toFixed(0)}</p><p className="text-[9px] uppercase text-muted-foreground">Earned</p></div>
                      <div className="p-2 rounded-lg bg-secondary/50 text-center"><p className="text-sm font-bold">{p.sales}</p><p className="text-[9px] uppercase text-muted-foreground">Sales</p></div>
                      <div className="p-2 rounded-lg bg-secondary/50 text-center"><p className="text-sm font-bold">{p.clicks}</p><p className="text-[9px] uppercase text-muted-foreground">Clicks</p></div>
                    </div>
                    <Button onClick={() => generateLink(p)} className="w-full h-9 rounded-xl font-semibold text-xs" size="sm">
                      {copiedId === p.id ? <><Check className="h-3.5 w-3.5 mr-1.5" /> Copied!</> : <><LinkIcon className="h-3.5 w-3.5 mr-1.5" /> Copy Link</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center"><Zap className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total from Top Products</p>
                <p className="text-lg font-bold text-foreground">${items.reduce((s, p) => s + p.earnings, 0).toFixed(2)}</p>
              </div>
            </div>
            {items[0] && (
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" />
                <p className="text-xs font-medium text-foreground">Top: <span className="text-primary">{items[0].title}</span></p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopProductsCarousel;
