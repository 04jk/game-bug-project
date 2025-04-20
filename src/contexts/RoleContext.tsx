
import React, { createContext, useContext } from 'react';
import { UserRole } from '@/types/user';
import { RoleContextType } from './types/roleContextTypes';
import { rolePermissions } from './permissions/rolePermissions';
import { useRoleManagement } from './hooks/useRoleManagement';

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { userRole, user, session, isLoading } = useRoleManagement();
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isProjectManager = userRole === UserRole.PROJECT_MANAGER;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isTester = userRole === UserRole.TESTER;
  
  const can = (action: string): boolean => {
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

