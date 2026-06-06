import { useEffect, useRef, useState } from "react";
import { Award, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const CertificateGenerator = () => {
  const { user, profile } = useAuth();
  const [completed, setCompleted] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*, courses(title, id)")
        .eq("user_id", user.id)
        .eq("status", "completed");
      setCompleted(data || []);
    })();
  }, [user]);

  const download = () => {
    if (!ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${current?.courses?.title || "course"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Certificates</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Generated upon course completion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {completed.map((e: any) => (
          <Card key={e.id} className="p-6 glass-subtle cursor-pointer hover:border-primary/40" onClick={() => setCurrent(e)}>
            <Award className="w-6 h-6 text-primary mb-3" />
            <div className="font-black uppercase tracking-tighter">{e.courses?.title}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Completed {new Date(e.updated_at || e.created_at).toLocaleDateString()}</div>
          </Card>
        ))}
        {completed.length === 0 && <div className="col-span-2 text-center text-muted-foreground text-sm py-12">Complete a course to earn your first certificate.</div>}
      </div>

      {current && (
        <Card className="p-6 glass-subtle" ref={ref}>
          <svg viewBox="0 0 800 560" className="w-full">
            <rect width="800" height="560" fill="hsl(var(--background))" />
            <rect x="20" y="20" width="760" height="520" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
            <rect x="35" y="35" width="730" height="490" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
            <text x="400" y="120" textAnchor="middle" fontSize="20" fontWeight="900" fill="hsl(var(--muted-foreground))" letterSpacing="6">CERTIFICATE OF COMPLETION</text>
            <text x="400" y="220" textAnchor="middle" fontSize="48" fontWeight="900" fill="hsl(var(--foreground))" fontStyle="italic">{profile?.full_name || "Learner"}</text>
            <text x="400" y="280" textAnchor="middle" fontSize="14" fill="hsl(var(--muted-foreground))">has successfully completed</text>
            <text x="400" y="340" textAnchor="middle" fontSize="28" fontWeight="900" fill="hsl(var(--primary))">{current.courses?.title}</text>
            <text x="400" y="460" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))" letterSpacing="3">AFFILYT ACADEMY · {new Date().toLocaleDateString()}</text>
          </svg>
          <Button onClick={download} className="mt-4 gap-2"><Download className="w-4 h-4" /> Download Certificate</Button>
        </Card>
      )}
    </div>
  );
};

export default CertificateGenerator;
