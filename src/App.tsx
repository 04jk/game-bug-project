
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
import FAQ from "./pages/info/FAQ";
import NotFound from "./pages/NotFound";
import { RoleProvider } from "./contexts/RoleContext";
import UserManagement from "./pages/admin/UserManagement";
import RoleGuard from "./components/auth/RoleGuard";
import { UserRole } from "./types/user";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Create a simple Contact component for the info/contact route
const Contact = () => (
  <TabsContent value="contact">
    <div className="py-4">
      <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
      <p className="mb-4">Need help with BugSquasher? Our support team is ready to assist you.</p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-2">Email Support</h3>
        <p>Email us at: <a href="mailto:support@bugsquasher.com" className="text-primary hover:underline">support@bugsquasher.com</a></p>
        <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours during business days.</p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-2">Business Hours</h3>
        <p>Monday to Friday: 9am to 5pm EST</p>
        <p>Weekend support available for emergency issues only.</p>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-lg mb-2">Admin Support</h3>
        <p>For Admin or Project Manager role access:</p>
        <p>Contact your organization's system administrator or email <a href="mailto:admin@bugsquasher.com" className="text-primary hover:underline">admin@bugsquasher.com</a> with your request.</p>
      </div>
    </div>
  </TabsContent>
);

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
              
              {/* Main Dashboard */}
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
              
              {/* Chat Room Route - For Developers and Testers */}
              <Route 
                path="/chat" 
                element={
                  <Layout>
                    <RoleGuard 
                      allowedRoles={[UserRole.DEVELOPER, UserRole.TESTER, UserRole.ADMIN]}
                      fallback={<Navigate to="/" replace />}
                    >
                      <ChatRoom />
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
              
              {/* Info Routes with proper nesting */}
              <Route path="/info" element={<Layout><InfoLayout /></Layout>}>
                <Route index element={<Navigate to="/info/getting-started" replace />} />
                <Route path="getting-started" element={<GettingStarted />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contact" element={<Contact />} />
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
