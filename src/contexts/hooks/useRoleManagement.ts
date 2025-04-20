
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database.types';

export const useRoleManagement = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TESTER);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setRoleFromProfile = async (userId: string) => {
    try {
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        console.log("Auth state changed:", event);
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        
        if (event === 'SIGNED_IN' && sessionData?.user) {
          setRoleFromProfile(sessionData.user.id);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userRole');
          setUserRole(UserRole.TESTER);
        }
      }
    );
    
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
          
          if (data.session.user) {
            await setRoleFromProfile(data.session.user.id);
          }
        } else {
          const cachedRole = localStorage.getItem('userRole');
          if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
            setUserRole(cachedRole as UserRole);
          }
          
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

  return {
    userRole,
    user,
    session,
    isLoading
  };
};

