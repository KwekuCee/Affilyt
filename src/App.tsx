import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Landing from "@/pages/Landing";
import Storefront from "@/pages/Storefront";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BecomeAffiliate from "@/pages/BecomeAffiliate";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import GlobalBackground from "@/components/GlobalBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <GlobalBackground />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/marketplace" element={<Storefront />} />
              <Route path="/become-affiliate" element={<BecomeAffiliate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard/affiliate/*" element={<AffiliateDashboard />} />
              <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
