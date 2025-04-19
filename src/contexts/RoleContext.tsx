
import React, { createContext, useContext, ReactNode } from 'react';
import { UserRole } from '@/types/user';
import { currentUser } from '@/data/generators/mockUsers';

interface RoleContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isProjectManager: boolean;
  isDeveloper: boolean;
  isTester: boolean;
  can: (action: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Define permissions for different roles
const rolePermissions = {
  [UserRole.ADMIN]: [
    'view_all_bugs', 
    'manage_users', 
    'view_reports', 
    'assign_bugs', 
    'update_bugs', 
    'create_bugs',
    'delete_bugs',
    'view_analytics',
    'manage_settings'
  ],
  [UserRole.PROJECT_MANAGER]: [
    'view_all_bugs', 
    'view_reports', 
    'assign_bugs', 
    'update_bugs', 
    'view_analytics',
    'manage_settings',
    'create_bugs'
  ],
  [UserRole.DEVELOPER]: [
    'view_assigned_bugs', 
    'update_bug_status', 
    'view_limited_reports',
    'view_basic_analytics'
  ],
  [UserRole.TESTER]: [
    'create_bugs', 
    'view_created_bugs', 
    'assign_bugs', 
    'attach_files',
    'send_notifications',
    'host_chats'
  ]
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // In a real app, we would fetch this from an auth service
  const userRole = currentUser.role;
  
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
