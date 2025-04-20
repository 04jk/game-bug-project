
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/user";
import { toast } from "sonner";

// This is a helper function to safely interact with Supabase
// It will use mock data if Supabase integration is not available
export const fetchUsersWithFallback = async (): Promise<User[]> => {
  try {
    // Try to fetch users from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data as unknown as User[];
    }
    
    // Fall back to mock data
    return import('@/data/generators/mockUsers').then(module => module.users);
  } catch (error) {
    console.log("Using mock data due to Supabase error or not connected");
    // Fall back to mock data
    return import('@/data/generators/mockUsers').then(module => module.users);
  }
};

// Helper for registering users with Supabase
export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  try {
    // Try to use Supabase auth if available
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      console.error("Supabase registration error:", error);
      toast.error("Registration failed: " + error.message);
      return null;
    }
    
    if (data.user) {
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: userData.name,
          role: userData.role
        });
        
      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Account created but profile setup failed.");
      }
    }
    
    return data;
  } catch (error) {
    console.log("Using mock registration flow");
    // Simulate successful registration
    toast.success("Registration successful (Mock)");
    return { user: { ...userData, id: `user-${Date.now()}` }, session: null };
  }
};

// Helper for logging in users with Supabase fallback
export const loginUser = async (email: string, password: string) => {
  try {
    // Try to use Supabase auth if available
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Supabase login error:", error);
      toast.error("Login failed: " + error.message);
      return null;
    }
    
    if (data.user) {
      // Fetch user profile to get role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', data.user.id)
        .single();
        
      if (profileData) {
        localStorage.setItem('userRole', profileData.role);
      }
    }
    
    return data;
  } catch (error) {
    console.log("Using mock login flow");
    // Mock login with existing users
    return import('@/data/generators/mockUsers').then(module => {
      const user = module.users.find(u => u.email === email);
      if (user) {
        localStorage.setItem('userRole', user.role);
        toast.success(`Welcome back, ${user.name}! (Mock)`);
        return { user, session: { user } };
      } else {
        toast.error("Invalid email or password (Mock)");
        return null;
      }
    });
  }
};

// Helper for logging out
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed: " + error.message);
      return false;
    }
    
    // Clear role from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileSettings');
    localStorage.removeItem('notificationSettings');
    localStorage.removeItem('appearanceSettings');
    
    toast.success("You have been logged out");
    return true;
  } catch (error) {
    console.log("Using mock logout flow");
    // Mock logout
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileSettings');
    localStorage.removeItem('notificationSettings');
    localStorage.removeItem('appearanceSettings');
    toast.success("You have been logged out (Mock)");
    return true;
  }
};

// Helper to get current user data
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
      
    if (userError || !userData) {
      return null;
    }
    
    return { ...userData, email: data.session.user.email };
  } catch (error) {
    console.log("Using mock user data");
    // Return mock current user
    return import('@/data/generators/mockUsers').then(module => {
      return module.currentUser;
    });
  }
};
