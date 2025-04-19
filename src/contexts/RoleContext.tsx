
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
