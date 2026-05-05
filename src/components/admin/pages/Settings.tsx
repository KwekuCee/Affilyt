import PageHeader from "@/components/admin/PageHeader";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user, profile } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" description="Account information." />
      <div className="rounded-lg border border-border glass-subtle p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Name</div>
            <div className="text-sm font-semibold">{profile?.full_name || "Admin"}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Email</div>
            <div className="text-sm font-semibold">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Role</div>
            <div className="text-sm font-semibold">Superadmin</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Account ID</div>
            <div className="text-xs font-mono">{user?.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
