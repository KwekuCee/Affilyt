import { useEffect, useState } from "react";
import { Crown, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { toast } from "sonner";

const SellerSubscriptions = () => {
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("seller_subscriptions")
      .select("*, profiles!seller_subscriptions_user_id_fkey(full_name, email)")
      .order("created_at", { ascending: false });
    setSubs(data || []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("seller_subscriptions").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <PageHeader title="Seller Subscriptions" subtitle="$50/year seller plan management" icon={Crown} />
      <div className="grid gap-3">
        {subs.map((s) => (
          <Card key={s.id} className="p-5 flex items-center justify-between glass-subtle">
            <div>
              <div className="font-black uppercase tracking-tight">{s.profiles?.full_name || s.user_id}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3" /> Renews {s.renews_at ? new Date(s.renews_at).toLocaleDateString() : "—"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={s.status === "active" ? "default" : "secondary"} className="uppercase text-[10px]">{s.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setStatus(s.id, s.status === "active" ? "cancelled" : "active")}>
                {s.status === "active" ? "Cancel" : "Activate"}
              </Button>
            </div>
          </Card>
        ))}
        {subs.length === 0 && <div className="text-center text-muted-foreground text-sm py-12">No seller subscriptions yet.</div>}
      </div>
    </div>
  );
};

export default SellerSubscriptions;
