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
import BecomeVendor from "@/pages/BecomeVendor";
import BecomeAffiliate from "@/pages/BecomeAffiliate";
import LearnerDashboard from "@/pages/LearnerDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import GlobalBackground from "@/components/GlobalBackground";
import AffiliatePricing from "@/pages/AffiliatePricing";
import LearnerCheckout from "@/pages/LearnerCheckout";
import ProductStorefront from "@/pages/Storefront";
import CoursePlayer from "@/pages/CoursePlayer";
import TermsOfService from "@/pages/TermsOfService";
import Marketplace from "@/pages/Marketplace";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";

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
              <Route path="/become-vendor" element={<BecomeVendor />} />
              <Route path="/become-affiliate" element={<BecomeAffiliate />} />
              <Route path="/become-seller" element={<BecomeVendor />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/affiliate-pricing" element={<AffiliatePricing />} />
              <Route path="/learner-checkout" element={<LearnerCheckout />} />
              <Route path="/product/:productId" element={<ProductStorefront />} />
              <Route path="/dashboard/affiliate/*" element={<AffiliateDashboard />} />
              <Route path="/dashboard/vendor/*" element={<VendorDashboard />} />
              <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
              <Route path="/dashboard/learner/*" element={<LearnerDashboard />} />
              <Route path="/course/:productId" element={<CoursePlayer />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
