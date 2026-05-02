import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShieldCheck, Search } from "lucide-react";

interface UserRow {
  user_id: string;
  full_name: string | null;
  email?: string;
  package_tier: string | null;
  country: string | null;
  created_at: string;
  roles: string[];
}

const tiers = ["", "Basic", "Standard", "Pro"];

const Users = () => {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, package_tier, country, created_at")
      .order("created_at", { ascending: false });

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    const rolesByUser: Record<string, string[]> = {};
    (roles || []).forEach((r: any) => {
      rolesByUser[r.user_id] = [...(rolesByUser[r.user_id] || []), r.role];
    });

    setRows(
      (profiles || []).map((p: any) => ({
        ...p,
        roles: rolesByUser[p.user_id] || [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateTier = async (userId: string, tier: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ package_tier: tier || null })
      .eq("user_id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Tier updated" });
      load();
    }
  };

  const toggleRole = async (userId: string, role: "admin" | "seller", has: boolean) => {
    if (has) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      toast({ title: `Removed ${role}` });
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role });
      toast({ title: `Granted ${role}` });
    }
    load();
  };

  const filtered = rows.filter(
    (r) =>
      !search ||
      (r.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      r.user_id.includes(search)
  );

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage roles, tiers, and access for every account on the platform."
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-64"
            />
          </div>
        }
      />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Country</th>
              <th className="text-left px-4 py-3 font-medium">Affiliate Tier</th>
              <th className="text-left px-4 py-3 font-medium">Roles</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No users found.</td></tr>
            )}
            {filtered.map((r) => {
              const isAdmin = r.roles.includes("admin");
              const isSeller = r.roles.includes("seller");
              return (
                <tr key={r.user_id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.user_id.slice(0, 8)}…</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.country || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.package_tier || ""}
                      onChange={(e) => updateTier(r.user_id, e.target.value)}
                      className="h-8 px-2 rounded-md border border-border bg-background text-sm"
                    >
                      {tiers.map((t) => (
                        <option key={t} value={t}>{t || "None"}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.roles.map((rl) => (
                        <Badge key={rl} variant="secondary" className="text-xs">{rl}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => toggleRole(r.user_id, "admin", isAdmin)}>
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        {isAdmin ? "Revoke admin" : "Make admin"}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => toggleRole(r.user_id, "seller", isSeller)}>
                        {isSeller ? "Revoke seller" : "Make seller"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
