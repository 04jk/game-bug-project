
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form schema for registration
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.TESTER], {
    required_error: "Please select a role",
  }),
  secretCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Secret codes for admin and project manager roles
const ROLE_SECRET_CODES = {
  [UserRole.ADMIN]: "admin1234",
  [UserRole.PROJECT_MANAGER]: "pm1234"
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSecretCode, setShowSecretCode] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        toast.info("You're already logged in");
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.TESTER, // Default role is Tester
      secretCode: "",
    }
  });

  // Watch the role value to determine if secret code is needed
  const watchedRole = form.watch("role");
  
  useEffect(() => {
    // Show secret code field for Admin and Project Manager roles
    setShowSecretCode(
      watchedRole === UserRole.ADMIN || 
      watchedRole === UserRole.PROJECT_MANAGER
    );
  }, [watchedRole]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if secret code is required and correct for the selected role
      if ((data.role === UserRole.ADMIN || data.role === UserRole.PROJECT_MANAGER) && 
          data.secretCode !== ROLE_SECRET_CODES[data.role]) {
        setAuthError("Invalid secret code for the selected role");
        setIsLoading(false);
        return;
      }
      
      // Register the user with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        }
      });
      
      if (error) {
        setAuthError(error.message);
        toast.error("Registration failed: " + error.message);
      } else if (authData.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: data.name,
            role: data.role
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast.error("Account created but profile setup failed.");
        } else {
          toast.success("Registration successful! Please check your email to verify your account.");
          toast.info("For development purposes, you can disable email verification in the Supabase dashboard.");
          navigate('/login');
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register to join the Bug Tracking System
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.TESTER}>Tester</SelectItem>
                          <SelectItem value={UserRole.DEVELOPER}>Developer</SelectItem>
                          <SelectItem value={UserRole.PROJECT_MANAGER}>Project Manager</SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Secret Code field that appears only for Admin and Project Manager roles */}
                {showSecretCode && (
                  <FormField
                    control={form.control}
                    name="secretCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret Code</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter secret code" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          A secret code is required for Admin and Project Manager roles
                        </p>
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
