
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { users } from '@/data/generators/mockUsers';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole } from '@/types/user';

const UserManagement = () => {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex justify-between">
          <Button variant="default">Add New User</Button>
          <Button variant="outline">Export Users</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {user.role}
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default UserManagement;
