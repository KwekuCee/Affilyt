import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  variant: string;
  audience: string;
  cta_label: string | null;
  cta_url: string | null;
}

interface Props { audience: "admin" | "affiliate" | "vendor" | "learner" }

const AnnouncementBanner = ({ audience }: Props) => {
  const [item, setItem] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dismissed_announcements") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    const load = async () => {
      const audMap: Record<string, string[]> = {
        affiliate: ["all", "affiliates"],
        vendor: ["all", "sellers"],
        admin: ["all", "admins"],
        learner: ["all", "learners"],
      };
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .in("audience", audMap[audience] || ["all"])
        .order("created_at", { ascending: false })
        .limit(1);
      const fresh = (data as any)?.[0];
      if (fresh && !dismissed.includes(fresh.id)) setItem(fresh);
    };
    load();
  }, [audience, dismissed]);

  if (!item) return null;

  const dismiss = () => {
    const next = [...dismissed, item.id];
    setDismissed(next);
    localStorage.setItem("dismissed_announcements", JSON.stringify(next));
    setItem(null);
  };

  const variantClass = item.variant === "warning"
    ? "border-warning/40 bg-warning/10"
    : item.variant === "success"
    ? "border-success/40 bg-success/10"
    : "border-primary/40 bg-primary/10";

  return (
    <div className={`mb-4 rounded-xl border ${variantClass} backdrop-blur-sm p-3 flex items-start gap-3`}>
      <Megaphone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.body}</p>
        {item.cta_url && (
          <a href={item.cta_url} className="text-xs text-primary hover:underline mt-1 inline-block">
            {item.cta_label || "Learn more"} →
          </a>
        )}
      </div>
      <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
