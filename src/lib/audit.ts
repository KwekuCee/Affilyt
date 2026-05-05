import { supabase } from "@/integrations/supabase/client";

export async function logAudit(action: string, target_type?: string, target_id?: string, details: Record<string, any> = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("audit_log").insert({
      admin_id: user.id,
      admin_email: user.email,
      action,
      target_type: target_type || null,
      target_id: target_id || null,
      details,
    });
  } catch {/* swallow */}
}
