
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
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

// Helper for registering users with Supabase fallback
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
    
    return data;
  } catch (error) {
    console.log("Using mock login flow");
    // Mock login with existing users
    return import('@/data/generators/mockUsers').then(module => {
      const user = module.users.find(u => u.email === email);
      if (user) {
        toast.success(`Welcome back, ${user.name}! (Mock)`);
        return { user, session: { user } };
      } else {
        toast.error("Invalid email or password (Mock)");
        return null;
      }
    });
  }
};
