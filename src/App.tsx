import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
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
import Rental from "./pages/Rental";
import Careers from "./pages/Careers"; // 👈 Add this import
import NotFound from "./pages/NotFound.tsx";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/map" element={<StationMap />} />
              <Route path="/investment" element={<Investment />} />
              <Route path="/rental" element={<Rental />} />
              <Route path="/jobs" element={<Careers />} /> {/* 👈 Changed from Stub to Careers */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/media" element={<Stub titleKey="nav.media" />} />
              <Route path="/faq" element={<Stub titleKey="nav.faq" />} />
              <Route path="/contact" element={<Stub titleKey="nav.contact" />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;