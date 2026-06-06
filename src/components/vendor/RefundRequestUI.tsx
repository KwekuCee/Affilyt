import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RefundRequestUI = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [reason, setReason] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("id,amount,buyer_email,created_at,status")
      .eq("seller_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(30);
    setOrders(data || []);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!selected) return;
    const { error } = await supabase.from("refunds").insert({
      order_id: selected.id,
      amount: selected.amount,
      reason,
      status: "pending",
    });
    if (error) toast.error(error.message);
    else { toast.success("Refund requested"); setReason(""); setSelected(null); load(); }
  };

  return (
    <Card className="p-6 glass-subtle">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
        <AlertTriangle className="w-3 h-3" /> Flag Order for Refund
      </div>
      <div className="space-y-2 max-h-80 overflow-auto">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{o.buyer_email}</div>
              <div className="text-[10px] text-muted-foreground">${Number(o.amount).toFixed(2)} · {new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelected(o)}>Refund</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Refund Request</DialogTitle></DialogHeader>
                <Textarea placeholder="Reason for refund..." value={reason} onChange={(e) => setReason(e.target.value)} />
                <Button onClick={submit} disabled={!reason}>Submit</Button>
              </DialogContent>
            </Dialog>
          </div>
        ))}
        {orders.length === 0 && <div className="text-center text-muted-foreground text-xs py-8">No completed orders.</div>}
      </div>
    </Card>
  );
};

export default RefundRequestUI;
