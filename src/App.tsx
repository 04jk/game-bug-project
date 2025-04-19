
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BugsList from "./pages/BugsList";
import BugDetail from "./pages/BugDetail";
import NewBug from "./pages/NewBug";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import About from "./pages/About";
import InfoLayout from "./pages/info/InfoLayout";
import GettingStarted from "./pages/info/GettingStarted";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/bugs" element={<Layout><BugsList /></Layout>} />
          <Route path="/bug/:id" element={<Layout><BugDetail /></Layout>} />
          <Route path="/new-bug" element={<Layout><NewBug /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/info" element={<InfoLayout />}>
            <Route path="getting-started" element={<GettingStarted />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
