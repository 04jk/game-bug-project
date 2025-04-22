
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoleContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isProjectManager: boolean;
  isDeveloper: boolean;
  isTester: boolean;
  can: (action: string) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Define role-specific permissions based on the flow diagram
const rolePermissions = {
  [UserRole.ADMIN]: [
    'view_users',
    'add_user',
    'update_user',
    'delete_user',
    'monitor_bugs',
    'monitor_testers',
    'monitor_developers',
    'manage_users',
    'view_analytics',
    'manage_settings',
    'view_reports',
    'create_bugs',
    'view_created_bugs',
    'assign_bugs',
    'view_developers',
    'host_chat',
    'attach_files',
    'send_notifications',
    'view_assigned_bugs',
    'update_bug_status',
    'finish_bug',
    'join_chat',
    'search_bugs',
    'view_docs'
  ],
  [UserRole.PROJECT_MANAGER]: [
    'check_performance',
    'monitor_bugs',
    'monitor_developers',
    'monitor_testers',
    'view_analytics',
    'view_reports',
    'manage_settings'
  ],
  [UserRole.DEVELOPER]: [
    'view_assigned_bugs',
    'update_bug_status',
    'finish_bug',
    'join_chat',
    'search_bugs',
    'view_docs'
  ],
  [UserRole.TESTER]: [
    'create_bugs',
    'view_created_bugs',
    'assign_bugs',
    'view_developers',
    'host_chat',
    'attach_files',
    'send_notifications'
  ]
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TESTER); // Default to Tester
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Function to fetch user role
    const fetchUserRole = async () => {
      setLoading(true);
      
      try {
        // First check localStorage for cached role (faster initial load)
        const cachedRole = localStorage.getItem('userRole');
        if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
          setUserRole(cachedRole as UserRole);
        }
        
        // Then try to get the current authenticated user
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          setIsAuthenticated(true);
          
          // Fetch user profile from Supabase
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load user role");
          } else if (profileData && profileData.role) {
            setUserRole(profileData.role as UserRole);
            localStorage.setItem('userRole', profileData.role);
          }
        } else {
          setIsAuthenticated(false);
          
          // If no session, check if we're in development mode and use default from mockUsers
          if (import.meta.env.DEV) {
            // In development, fall back to mock data
            import('@/data/generators/mockUsers').then(module => {
              setUserRole(module.currentUser.role);
            }).catch(err => {
              console.error("Failed to load mock user data:", err);
            });
          }
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        toast.error("Failed to authenticate user");
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        
        // Fetch user profile when signed in (using setTimeout to avoid auth deadlocks)
        setTimeout(async () => {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user!.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile after sign in:", error);
              toast.error("Failed to load user role");
            } else if (profileData && profileData.role) {
              setUserRole(profileData.role as UserRole);
              localStorage.setItem('userRole', profileData.role);
              toast.success(`Logged in as ${profileData.role}`);
            }
          } catch (error) {
            console.error("Error in auth state change handler:", error);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        // Clear role when signed out
        setIsAuthenticated(false);
        localStorage.removeItem('userRole');
        setUserRole(UserRole.TESTER); // Default back to Tester
        toast.info("You have been logged out");
      }
    });
    
    fetchUserRole();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isProjectManager = userRole === UserRole.PROJECT_MANAGER;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isTester = userRole === UserRole.TESTER;
  
  const can = (action: string): boolean => {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(action);
  };
  
  const value = {
    userRole,
    isAdmin,
    isProjectManager,
    isDeveloper,
    isTester,
    can,
    isAuthenticated,
    loading
  };
  
  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
