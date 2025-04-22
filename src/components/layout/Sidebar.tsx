
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bug, ChevronLeft, Home, BarChart2, PlusSquare, Settings, LogOut, Users, FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { toast } from 'sonner';
import { logoutUser } from '@/lib/supabase-connection';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ collapsed, toggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, isAdmin, isProjectManager, isDeveloper, isTester } = useRole();
  
  // Base navigation items for all users
  const baseNavItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  ];
  
  // Role-specific items
  const roleItems = {
    Tester: [
      { path: '/new-bug', label: 'Report Bug', icon: <PlusSquare className="h-5 w-5" /> },
      { path: '/bugs', label: 'My Bugs', icon: <Bug className="h-5 w-5" /> },
      { path: '/chat', label: 'Chat Rooms', icon: <MessageSquare className="h-5 w-5" /> },
    ],
    Developer: [
      { path: '/bugs', label: 'Assigned Bugs', icon: <Bug className="h-5 w-5" /> },
      { path: '/chat', label: 'Chat Rooms', icon: <MessageSquare className="h-5 w-5" /> },
      { path: '/search', label: 'Search', icon: <Search className="h-5 w-5" /> },
    ],
    'Project Manager': [
      { path: '/bugs', label: 'All Bugs', icon: <Bug className="h-5 w-5" /> },
      { path: '/analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
      { path: '/reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
    ],
    Admin: [
      { path: '/bugs', label: 'All Bugs', icon: <Bug className="h-5 w-5" /> },
      { path: '/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
      { path: '/analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
      { path: '/chat', label: 'Chat Rooms', icon: <MessageSquare className="h-5 w-5" /> },
    ],
  };
  
  // Get role-specific navigation items
  const roleNavItems = roleItems[userRole] || [];
  
  // Settings is available to all users
  const navItems = [
    ...baseNavItems,
    ...roleNavItems,
    { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div 
      className={cn(
        "h-screen bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1">
            <Bug className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">BugSquasher</h1>
          </div>
        )}
        {collapsed && <Bug className="h-6 w-6 text-primary mx-auto" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse} 
          className={collapsed ? "mx-auto" : ""}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="flex-1 py-6">
        <nav>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Add role indicator */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">Current Role</div>
          <div className="font-medium text-sm">{userRole}</div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          size={collapsed ? "icon" : "default"} 
          className={cn("w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50", 
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
