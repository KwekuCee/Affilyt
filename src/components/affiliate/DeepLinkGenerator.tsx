import { useEffect, useState } from "react";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const DeepLinkGenerator = () => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from("products").select("id,title,price").eq("status", "active").limit(50).then(({ data }) => setProducts(data || []));
  }, []);

  const toggle = (id: string) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const generate = () => {
    if (!user || selected.size === 0) return;
    const ref = profile?.username || user.id.substring(0, 8);
    const ids = Array.from(selected).join(",");
    const link = `${window.location.origin}/cart?ref=${ref}&items=${ids}`;
    setGenerated(link);
  };

  const copy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 glass-subtle">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
        <LinkIcon className="w-3 h-3" /> Multi-Product Deep Link
      </div>
      <div className="space-y-2 max-h-64 overflow-auto pr-2 mb-4">
        {products.map((p) => (
          <label key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 cursor-pointer hover:bg-secondary/60">
            <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} />
            <div className="flex-1 text-sm font-bold truncate">{p.title}</div>
            <div className="text-xs font-black text-primary">${Number(p.price).toFixed(2)}</div>
          </label>
        ))}
      </div>
      <Button onClick={generate} disabled={selected.size === 0} className="w-full h-12 rounded-2xl font-black uppercase tracking-widest mb-3">
        Generate Link ({selected.size} items)
      </Button>
      {generated && (
        <div className="flex gap-2">
          <Input value={generated} readOnly className="font-mono text-xs" />
          <Button onClick={copy} variant="outline" size="icon" className="h-10 w-10 shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DeepLinkGenerator;
