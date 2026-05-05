import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Mail } from "lucide-react";
import { logAudit } from "@/lib/audit";

const Broadcast = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: "", body: "", audience: "all" });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("broadcasts").select("*").order("created_at", { ascending: false }).limit(50);
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const queue = async () => {
    if (!form.subject || !form.body) { toast({ title: "Subject and body required", variant: "destructive" }); return; }
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    let count = 0;
    if (form.audience === "all") count = (await supabase.from("profiles").select("user_id", { count: "exact", head: true })).count || 0;
    else if (form.audience === "affiliates") count = (await supabase.from("profiles").select("user_id", { count: "exact", head: true }).not("package_tier", "is", null)).count || 0;
    else if (form.audience === "sellers") count = (await supabase.from("seller_subscriptions").select("user_id", { count: "exact", head: true }).eq("status", "active")).count || 0;

    const { error } = await supabase.from("broadcasts").insert({ ...form, recipient_count: count, created_by: user?.id, status: "queued" });
    setSending(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await logAudit("queue_broadcast", "broadcast", undefined, { audience: form.audience, recipients: count });
    toast({ title: "Queued", description: `${count} recipients. Sending wires up later.` });
    setForm({ subject: "", body: "", audience: "all" });
    load();
  };

  return (
    <div>
      <PageHeader title="Email Broadcast" description="Queue announcements to all affiliates, sellers, or everyone. Delivery happens via worker." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div>
            <label className="text-xs font-medium">Audience</label>
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
              <option value="all">Everyone</option><option value="affiliates">Affiliates only</option><option value="sellers">Sellers only</option>
            </select>
          </div>
          <div><label className="text-xs font-medium">Subject</label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div><label className="text-xs font-medium">Message</label><Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <Button onClick={queue} disabled={sending} className="w-full"><Send className="h-4 w-4 mr-1" />{sending ? "Queueing…" : "Queue broadcast"}</Button>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Recent broadcasts</h3>
          <div className="space-y-2">
            {items.length === 0 && <div className="text-sm text-muted-foreground rounded-lg border border-dashed border-border p-8 text-center">No broadcasts yet.</div>}
            {items.map((b) => (
              <div key={b.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="font-medium text-sm line-clamp-1">{b.subject}</span></div>
                  <Badge variant={b.status === "sent" ? "default" : "secondary"}>{b.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{b.body}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{b.audience} · {b.recipient_count} recipients</span>
                  <span>{new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
