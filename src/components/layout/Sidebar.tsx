
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bug,
  FileQuestion,
  Home,
  MessageSquare,
  Plus,
  Settings,
  Users,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRole } from "@/contexts/RoleContext";
import LogoutButton from "@/components/auth/LogoutButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, isAdmin, isProjectManager, isDeveloper, isTester, can } = useRole();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed: " + error.message);
      } else {
        // Clear role from localStorage
        localStorage.removeItem('userRole');
        toast.success("You have been logged out");
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  const items = [
    {
      title: "Dashboard",
      icon: Home,
      link: "/",
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.TESTER],
    },
    {
      title: "Bug List",
      icon: Bug,
      link: "/bugs",
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.TESTER],
    },
    {
      title: "Create Bug",
      icon: Plus,
      link: "/new-bug",
      roles: [UserRole.ADMIN, UserRole.TESTER],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      link: "/analytics",
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER],
    },
    {
      title: "Chat Room",
      icon: MessageSquare,
      link: "/chat",
      roles: [UserRole.ADMIN, UserRole.DEVELOPER, UserRole.TESTER],
    },
    {
      title: "User Management",
      icon: Users,
      link: "/users",
      roles: [UserRole.ADMIN],
    },
  ];

  const DashboardLink = ({
    title,
    icon: Icon,
    link,
    active,
  }: {
    title: string;
    icon: any;
    link: string;
    active: boolean;
  }) => {
    return (
      <Link
        to={link}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
          active && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{title}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </Link>
    );
  };

  const Sidebar = (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Bug Tracking System
          </h2>
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              Role: {userRole}
            </div>
            <LogoutButton />
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500">
            Main
          </h2>
          <div className="space-y-1">
            {items
              .filter((item) => item.roles.includes(userRole as UserRole))
              .map((item) => (
                <DashboardLink
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  link={item.link}
                  active={isActive(item.link)}
                />
              ))}
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500">
            Settings
          </h2>
          <div className="space-y-1">
            <DashboardLink
              title="Settings"
              icon={Settings}
              link="/settings"
              active={isActive("/settings")}
            />
            <DashboardLink
              title="About"
              icon={Info}
              link="/about"
              active={isActive("/about")}
            />
            <DashboardLink
              title="Help & Support"
              icon={FileQuestion}
              link="/info/getting-started"
              active={isActive("/info/getting-started")}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed left-4 top-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            {Sidebar}
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <aside className="hidden border-r bg-gray-50/40 md:flex md:w-64 md:flex-col">
        <ScrollArea className="flex-grow">
          {Sidebar}
        </ScrollArea>
      </aside>
    </>
  );
}
