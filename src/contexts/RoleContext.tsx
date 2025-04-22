
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface RoleContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isProjectManager: boolean;
  isDeveloper: boolean;
  isTester: boolean;
  can: (action: string) => boolean;
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
  
  useEffect(() => {
    // Function to fetch user role
    const fetchUserRole = async () => {
      // First check localStorage for cached role (faster initial load)
      const cachedRole = localStorage.getItem('userRole');
      if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
        setUserRole(cachedRole as UserRole);
      }
      
      // Then try to get the current authenticated user
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        // Fetch user profile from Supabase
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData && profileData.role) {
          setUserRole(profileData.role as UserRole);
          localStorage.setItem('userRole', profileData.role);
        }
      } else {
        // If no session, check if we're in development mode and use default from mockUsers
        if (import.meta.env.DEV) {
          // In development, fall back to mock data
          import('@/data/generators/mockUsers').then(module => {
            setUserRole(module.currentUser.role);
          });
        }
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile when signed in
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileData && profileData.role) {
          setUserRole(profileData.role as UserRole);
          localStorage.setItem('userRole', profileData.role);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear role when signed out
        localStorage.removeItem('userRole');
        setUserRole(UserRole.TESTER); // Default back to Tester
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
    can
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
