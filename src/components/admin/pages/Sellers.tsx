import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Sellers = () => {
  const [rows, setRows] = useState<any[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data: subs } = await supabase
      .from("seller_subscriptions")
      .select("id, user_id, status, amount, started_at, expires_at, payment_reference")
      .order("created_at", { ascending: false });

    const userIds = (subs || []).map((s: any) => s.user_id);
    let profiles: any[] = [];
    if (userIds.length) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, business_name, country")
        .in("user_id", userIds);
      profiles = data || [];
    }
    const byId: Record<string, any> = {};
    profiles.forEach((p) => (byId[p.user_id] = p));

    setRows((subs || []).map((s: any) => ({ ...s, profile: byId[s.user_id] || {} })));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("seller_subscriptions").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Updated" }); load(); }
  };

  return (
    <div>
      <PageHeader title="Sellers" description="Manage seller subscriptions and access." />
      <div className="rounded-lg border border-border glass-subtle overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Seller</th>
              <th className="text-left px-4 py-3 font-medium">Business</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Expires</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No sellers yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.profile?.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.profile?.country || ""}</div>
                </td>
                <td className="px-4 py-3">{r.profile?.business_name || "—"}</td>
                <td className="px-4 py-3">${Number(r.amount).toFixed(2)}/yr</td>
                <td className="px-4 py-3">
                  <Badge variant={r.status === "active" ? "default" : "secondary"}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.expires_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {r.status === "active" ? (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, "suspended")}>Suspend</Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, "active")}>Activate</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sellers;
