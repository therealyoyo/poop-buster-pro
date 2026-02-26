import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Residential from "./pages/Residential";
import Commercial from "./pages/Commercial";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCRM from "./pages/admin/CRM";
import AdminBilling from "./pages/admin/Billing";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import ClientDetail from "./pages/admin/ClientDetail";
import Pipeline from "./pages/admin/Pipeline";
import ZonesService from "./pages/admin/ZonesService";
import FieldApp from "./pages/admin/FieldApp";
import Pricing from "./pages/admin/Pricing";
import ClientDashboard from "./pages/portal/ClientDashboard";
import ClientInvoices from "./pages/portal/Invoices";
import ClientSettings from "./pages/portal/Settings";
import ClientMessages from "./pages/portal/Messages";
import QuoteAccept from "./pages/QuoteAccept";
import QuoteSuccess from "./pages/QuoteSuccess";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PortalLogin from "./pages/portal/PortalLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/residential" element={<Residential />} />
          <Route path="/services/commercial" element={<Commercial />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/clients" element={<AdminRoute><AdminCRM /></AdminRoute>} />
          <Route path="/admin/clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
          <Route path="/admin/pipeline" element={<AdminRoute><Pipeline /></AdminRoute>} />
          <Route path="/admin/billing" element={<AdminRoute><AdminBilling /></AdminRoute>} />
          <Route path="/admin/zones" element={<AdminRoute><ZonesService /></AdminRoute>} />
          <Route path="/admin/field" element={<AdminRoute><FieldApp /></AdminRoute>} />
          <Route path="/admin/pricing" element={<AdminRoute><Pricing /></AdminRoute>} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
          <Route path="/portal/messages" element={<ClientRoute><ClientMessages /></ClientRoute>} />
          <Route path="/portal/invoices" element={<ClientRoute><ClientInvoices /></ClientRoute>} />
          <Route path="/portal/settings" element={<ClientRoute><ClientSettings /></ClientRoute>} />
          <Route path="/quote/accept/:token" element={<QuoteAccept />} />
          <Route path="/quote/success" element={<QuoteSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
