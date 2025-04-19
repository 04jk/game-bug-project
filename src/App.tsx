
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { RoleProvider } from "./contexts/RoleContext";
import UserManagement from "./pages/admin/UserManagement";
import RoleGuard from "./components/auth/RoleGuard";
import { UserRole } from "./types/user";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              
              {/* Developer & Tester Routes */}
              <Route 
                path="/bugs" 
                element={
                  <Layout>
                    <RoleGuard 
                      allowedRoles={[UserRole.DEVELOPER, UserRole.TESTER, UserRole.PROJECT_MANAGER, UserRole.ADMIN]}
                    >
                      <BugsList />
                    </RoleGuard>
                  </Layout>
                } 
              />
              <Route path="/bug/:id" element={<Layout><BugDetail /></Layout>} />
              
              {/* Tester Only Routes */}
              <Route 
                path="/new-bug" 
                element={
                  <Layout>
                    <RoleGuard 
                      allowedRoles={[UserRole.TESTER, UserRole.ADMIN]}
                      fallback={<Navigate to="/" replace />}
                    >
                      <NewBug />
                    </RoleGuard>
                  </Layout>
                } 
              />
              
              {/* Project Manager & Admin Routes */}
              <Route 
                path="/analytics" 
                element={
                  <Layout>
                    <RoleGuard 
                      allowedRoles={[UserRole.PROJECT_MANAGER, UserRole.ADMIN]}
                      fallback={<Navigate to="/" replace />}
                    >
                      <Analytics />
                    </RoleGuard>
                  </Layout>
                } 
              />
              
              {/* Admin Only Routes */}
              <Route 
                path="/users" 
                element={
                  <Layout>
                    <RoleGuard 
                      allowedRoles={[UserRole.ADMIN]}
                      fallback={<Navigate to="/" replace />}
                    >
                      <UserManagement />
                    </RoleGuard>
                  </Layout>
                } 
              />
              
              {/* Common Routes */}
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/info" element={<InfoLayout>}>
                <Route path="getting-started" element={<GettingStarted />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoleProvider>
    </QueryClientProvider>
  );
};

export default App;
