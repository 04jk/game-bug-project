
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { Tables } from '@/types/database.types';

interface RoleContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isProjectManager: boolean;
  isDeveloper: boolean;
  isTester: boolean;
  can: (action: string) => boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
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
    'view_docs',
    'export_users',
    'import_users'
  ],
  [UserRole.PROJECT_MANAGER]: [
    'check_performance',
    'monitor_bugs',
    'monitor_developers',
    'monitor_testers',
    'view_analytics',
    'view_reports',
    'manage_settings',
    'assign_bugs',
    'view_assigned_bugs',
    'view_created_bugs'
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Function to set user role based on Supabase profile
    const setRoleFromProfile = async (userId: string) => {
      try {
        // Fetch user profile from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single() as { data: Tables['profiles']['Row'] | null, error: any };
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (data && data.role) {
          const roleValue = data.role as UserRole;
          setUserRole(roleValue);
          localStorage.setItem('userRole', roleValue);
        }
      } catch (error) {
        console.error("Error in setRoleFromProfile:", error);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        console.log("Auth state changed:", event);
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        
        if (event === 'SIGNED_IN' && sessionData?.user) {
          // When user signs in, fetch their role
          setRoleFromProfile(sessionData.user.id);
        } else if (event === 'SIGNED_OUT') {
          // Clear role when signed out
          localStorage.removeItem('userRole');
          setUserRole(UserRole.TESTER); // Default back to Tester
        }
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          return;
        }
        
        if (data && data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Get user role from profile
          if (data.session.user) {
            await setRoleFromProfile(data.session.user.id);
          }
        } else {
          // No active session, check if we have a role in localStorage
          const cachedRole = localStorage.getItem('userRole');
          if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
            setUserRole(cachedRole as UserRole);
          }
          
          // In development, fall back to mock data if needed
          if (import.meta.env.DEV && !cachedRole) {
            try {
              const module = await import('@/data/generators/mockUsers');
              setUserRole(module.currentUser.role);
            } catch (err) {
              console.error("Error loading mock data:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isProjectManager = userRole === UserRole.PROJECT_MANAGER;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isTester = userRole === UserRole.TESTER;
  
  const can = (action: string): boolean => {
    // If no user is logged in, deny all permissions
    if (!user && !import.meta.env.DEV) {
      return false;
    }
    
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
    user,
    session,
    isLoading
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
