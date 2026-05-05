import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminShell from "@/components/admin/AdminShell";
import Overview from "@/components/admin/pages/Overview";
import Users from "@/components/admin/pages/Users";
import Sellers from "@/components/admin/pages/Sellers";
import Products from "@/components/admin/pages/Products";
import Withdrawals from "@/components/admin/pages/Withdrawals";
import Testimonials from "@/components/admin/pages/Testimonials";
import Blogs from "@/components/admin/pages/Blogs";
import Settings from "@/components/admin/pages/Settings";
import Activity from "@/components/admin/pages/Activity";
import Analytics from "@/components/admin/pages/Analytics";
import Tiers from "@/components/admin/pages/Tiers";
import Moderation from "@/components/admin/pages/Moderation";
import Broadcast from "@/components/admin/pages/Broadcast";
import Refunds from "@/components/admin/pages/Refunds";
import AuditLog from "@/components/admin/pages/AuditLog";
import Coupons from "@/components/admin/pages/Coupons";
import Health from "@/components/admin/pages/Health";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required.", variant: "destructive" });
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!user || !isAdmin) return null;

  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<Overview />} />
        <Route path="activity" element={<Activity />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="tiers" element={<Tiers />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="products" element={<Products />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="broadcast" element={<Broadcast />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="health" element={<Health />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
