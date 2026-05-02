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
        <Route path="users" element={<Users />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="products" element={<Products />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
