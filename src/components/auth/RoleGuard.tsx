
import React, { ReactNode } from 'react';
import { UserRole } from '@/types/user';
import { useRole } from '@/contexts/RoleContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  allowedPermissions?: string[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  allowedPermissions = [],
  fallback 
}: RoleGuardProps) => {
  const { userRole, can } = useRole();
  
  const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);
  const hasAllowedPermission = allowedPermissions.length === 0 || 
    allowedPermissions.some(permission => can(permission));
  
  if (hasAllowedRole && hasAllowedPermission) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Access Denied</AlertTitle>
      <AlertDescription>
        You don't have permission to view this content.
      </AlertDescription>
    </Alert>
  );
};

export default RoleGuard;
