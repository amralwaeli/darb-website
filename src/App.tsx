import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";  // 👈 changed
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import StationMap from "./pages/StationMap";
import Investment from "./pages/Investment";
import Stub from "./pages/Stub";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>  {/* 👈 changed */}
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/map" element={<StationMap />} />
              <Route path="/investment" element={<Investment />} />
              <Route path="/rental" element={<Stub titleKey="nav.rental" />} />
              <Route path="/jobs" element={<Stub titleKey="nav.jobs" />} />
              <Route path="/media" element={<Stub titleKey="nav.media" />} />
              <Route path="/faq" element={<Stub titleKey="nav.faq" />} />
              <Route path="/contact" element={<Stub titleKey="nav.contact" />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HashRouter>  {/* 👈 changed */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;