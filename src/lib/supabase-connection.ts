
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/user";
import { toast } from "sonner";

// This is a helper function to safely interact with Supabase
// It will use mock data if Supabase interaction fails
export const fetchUsersWithFallback = async (): Promise<User[]> => {
  try {
    // First try to fetch users from Supabase
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error("Supabase profiles error:", profilesError);
      throw profilesError;
    }
    
    // Get emails from auth.users (admin only)
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Auth users error:", authError);
      // Continue with just profiles data
    }
    
    if (profilesData && profilesData.length > 0) {
      // Map profiles to User interface
      const users: User[] = profilesData.map((profile: any) => {
        // Find matching auth user to get email
        const authUser = authData?.users.find(u => u.id === profile.id);
        
        return {
          id: profile.id,
          name: profile.name || '',
          email: authUser?.email || 'email@example.com', // Fallback if no email found
          role: profile.role as UserRole || UserRole.TESTER,
          avatar: profile.avatar,
          team: profile.team
        };
      });
      
      return users;
    }
    
    // Fall back to mock data if no profiles found
    return import('@/data/generators/mockUsers').then(module => module.users);
  } catch (error) {
    console.log("Using mock data due to Supabase error:", error);
    // Fall back to mock data
    return import('@/data/generators/mockUsers').then(module => module.users);
  }
};

// Helper for registering users with Supabase
export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  try {
    // Try to use Supabase auth
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
      } else {
        toast.success("Registration successful!");
      }
    }
    
    return data;
  } catch (error) {
    console.log("Registration error:", error);
    toast.error("Registration failed. Please try again.");
    return null;
  }
};

// Helper for logging in users with Supabase
export const loginUser = async (email: string, password: string) => {
  try {
    // Try to use Supabase auth
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
        localStorage.setItem('userRole', profileData.role as string);
        toast.success(`Welcome back, ${profileData.name}!`);
      } else {
        toast.success(`Welcome back, ${data.user.email}!`);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return null;
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
    console.error("Logout error:", error);
    toast.error("Logout failed. Please try again.");
    return false;
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
    
    return { 
      ...userData, 
      email: data.session.user.email 
    } as any;
  } catch (error) {
    console.log("Error getting current user:", error);
    // Return mock current user in development
    if (import.meta.env.DEV) {
      return import('@/data/generators/mockUsers').then(module => {
        return module.currentUser;
      });
    }
    return null;
  }
};

// Helper to update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<User>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        role: profileData.role,
        avatar: profileData.avatar,
        team: profileData.team,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile: " + error.message);
      return false;
    }
    
    toast.success("Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Profile update error:", error);
    toast.error("Failed to update profile");
    return false;
  }
};

// Helper to change password
export const changePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password: " + error.message);
      return false;
    }
    
    toast.success("Password changed successfully");
    return true;
  } catch (error) {
    console.error("Password change error:", error);
    toast.error("Failed to change password");
    return false;
  }
};

// Helper to reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email: " + error.message);
      return false;
    }
    
    toast.success("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error("Failed to send password reset email");
    return false;
  }
};
