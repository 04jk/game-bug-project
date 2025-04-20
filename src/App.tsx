
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import { RoleProvider, useRole } from "./contexts/RoleContext";
import UserManagement from "./pages/admin/UserManagement";
import RoleGuard from "./components/auth/RoleGuard";
import { UserRole } from "./types/user";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// AuthGuard component to protect routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useRole();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Check for session using Supabase directly
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // No session found
          setChecking(false);
        } else {
          // Session found
          setChecking(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setChecking(false);
      }
    };
    
    if (!isLoading) {
      if (user) {
        setChecking(false);
      } else {
        checkSession();
      }
    }
  }, [user, isLoading]);
  
  if (isLoading || checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes - Not inside layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Main Dashboard - Protected */}
              <Route 
                path="/" 
                element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Developer & Tester Routes */}
              <Route 
                path="/bugs" 
                element={
                  <AuthGuard>
                    <Layout>
                      <RoleGuard 
                        allowedRoles={[UserRole.DEVELOPER, UserRole.TESTER, UserRole.PROJECT_MANAGER, UserRole.ADMIN]}
                      >
                        <BugsList />
                      </RoleGuard>
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/bug/:id" 
                element={
                  <AuthGuard>
                    <Layout>
                      <BugDetail />
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Tester Only Routes */}
              <Route 
                path="/new-bug" 
                element={
                  <AuthGuard>
                    <Layout>
                      <RoleGuard 
                        allowedRoles={[UserRole.TESTER, UserRole.ADMIN]}
                        fallback={<Navigate to="/" replace />}
                      >
                        <NewBug />
                      </RoleGuard>
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Chat Room Route - For Developers and Testers */}
              <Route 
                path="/chat" 
                element={
                  <AuthGuard>
                    <Layout>
                      <RoleGuard 
                        allowedRoles={[UserRole.DEVELOPER, UserRole.TESTER, UserRole.ADMIN]}
                        fallback={<Navigate to="/" replace />}
                      >
                        <ChatRoom />
                      </RoleGuard>
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Project Manager & Admin Routes */}
              <Route 
                path="/analytics" 
                element={
                  <AuthGuard>
                    <Layout>
                      <RoleGuard 
                        allowedRoles={[UserRole.PROJECT_MANAGER, UserRole.ADMIN]}
                        fallback={<Navigate to="/" replace />}
                      >
                        <Analytics />
                      </RoleGuard>
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Admin Only Routes */}
              <Route 
                path="/users" 
                element={
                  <AuthGuard>
                    <Layout>
                      <RoleGuard 
                        allowedRoles={[UserRole.ADMIN]}
                        fallback={<Navigate to="/" replace />}
                      >
                        <UserManagement />
                      </RoleGuard>
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Common Routes */}
              <Route 
                path="/settings" 
                element={
                  <AuthGuard>
                    <Layout>
                      <Settings />
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/about" 
                element={
                  <AuthGuard>
                    <Layout>
                      <About />
                    </Layout>
                  </AuthGuard>
                } 
              />
              
              {/* Info Routes with proper nesting */}
              <Route 
                path="/info" 
                element={
                  <AuthGuard>
                    <Layout>
                      <InfoLayout />
                    </Layout>
                  </AuthGuard>
                }
              >
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
