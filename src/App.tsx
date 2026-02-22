import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCRM from "./pages/admin/CRM";
import AdminBilling from "./pages/admin/Billing";
import AdminRoute from "./components/AdminRoute";
import ClientDetail from "./pages/admin/ClientDetail";
import Pipeline from "./pages/admin/Pipeline";
import ZonesService from "./pages/admin/ZonesService";
import ClientDashboard from "./pages/portal/ClientDashboard";
import ClientInvoices from "./pages/portal/Invoices";
import ClientSettings from "./pages/portal/Settings";
import ClientMessages from "./pages/portal/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/clients" element={<AdminRoute><AdminCRM /></AdminRoute>} />
          <Route path="/admin/clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
          <Route path="/admin/pipeline" element={<AdminRoute><Pipeline /></AdminRoute>} />
          <Route path="/admin/billing" element={<AdminRoute><AdminBilling /></AdminRoute>} />
          <Route path="/admin/zones" element={<AdminRoute><ZonesService /></AdminRoute>} />
          <Route path="/portal" element={<ClientDashboard />} />
          <Route path="/portal/messages" element={<ClientMessages />} />
          <Route path="/portal/invoices" element={<ClientInvoices />} />
          <Route path="/portal/settings" element={<ClientSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
