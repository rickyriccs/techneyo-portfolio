import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "@/lib/admin-auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Offers from "./pages/Offers";
import Tools from "./pages/Tools";
import Contact from "./pages/Contact";
import PolicyPage from "./pages/PolicyPage";
import ServiceDetail from "./pages/ServiceDetail";
import LocalSeoPage from "./pages/LocalSeoPage";
import Resources from "./pages/Resources";
import ResourcePost from "./pages/ResourcePost";
import CompanyProfile from "./pages/CompanyProfile";
import Portfolio from "./pages/Portfolio";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import AnalyticsRouteTracker from "./components/AnalyticsRouteTracker";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResourceList from "./pages/admin/AdminResourceList";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminServices from "./pages/admin/AdminServices";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminOffers from "./pages/admin/AdminOffers";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

import OfferDetails from "./pages/OfferDetails";
import Onboarding from "./pages/Onboarding";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBlogs from "./pages/admin/AdminBlogs";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";

import { PersonalizationProvider } from "@/context/PersonalizationContext";
import SmartProposalModal from "@/components/interactive/SmartProposalModal";

import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<IndustryDetail />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/:slug" element={<OfferDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/techneyo-portfolio" element={<Portfolio />} />
          <Route path="/website-development-company-ludhiana" element={<LocalSeoPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourcePost />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
          <Route path="/terms-and-conditions" element={<PolicyPage type="terms" />} />
          <Route path="/refund-cancellation-policy" element={<PolicyPage type="refund" />} />
          <Route path="/support" element={<PolicyPage type="support" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="packages" element={<AdminResourceList type="packages" />} />
              <Route path="tools" element={<AdminResourceList type="tools" />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
      <SmartProposalModal />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminAuthProvider>
        <PersonalizationProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsRouteTracker />
            <AppRoutes />
          </BrowserRouter>
        </PersonalizationProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
