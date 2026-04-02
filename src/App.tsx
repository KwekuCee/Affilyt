import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import RoleToggle from "@/components/RoleToggle";
import Storefront from "@/pages/Storefront";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BecomeSeller from "@/pages/BecomeSeller";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route
          path="/dashboard/affiliate/*"
          element={role === "AFFILIATE" ? <AffiliateDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/admin/*"
          element={role === "SUPERADMIN" ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RoleToggle />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
