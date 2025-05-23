
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRole } from '@/contexts/RoleContext';
import { currentUser } from '@/data/generators/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  newBugNotifications: z.boolean(),
  statusChangeNotifications: z.boolean(),
  commentNotifications: z.boolean(),
  assignmentNotifications: z.boolean(),
});

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  bugsPerPage: z.enum(["10", "25", "50", "100"]),
  defaultSort: z.string(),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
});

const Settings = () => {
  const { userRole } = useRole();
  const navigate = useNavigate();
  
  // Load saved settings from localStorage on component mount
  useEffect(() => {
    // Load profile settings
    const savedProfileSettings = localStorage.getItem('profileSettings');
    if (savedProfileSettings) {
      const parsedSettings = JSON.parse(savedProfileSettings);
      profileForm.reset(parsedSettings);
    }

    // Load notification settings
    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
      const parsedSettings = JSON.parse(savedNotificationSettings);
      notificationsForm.reset(parsedSettings);
    }

    // Load appearance settings
    const savedAppearanceSettings = localStorage.getItem('appearanceSettings');
    if (savedAppearanceSettings) {
      const parsedSettings = JSON.parse(savedAppearanceSettings);
      appearanceForm.reset(parsedSettings);
      
      // Apply theme immediately
      applyTheme(parsedSettings.theme);
    }
    
    // Check if user is authenticated
    checkAuth();
  }, []);
  
  // Check if user is authenticated
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error("You must be logged in to access settings");
      navigate('/login');
    }
  };
  
  // Apply theme function
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "johnd",
      email: currentUser.email,
      name: currentUser.name,
    },
  });
  
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      newBugNotifications: true,
      statusChangeNotifications: true,
      commentNotifications: true,
      assignmentNotifications: true,
    },
  });
  
  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "light",
      bugsPerPage: "25",
      defaultSort: "createdAt-desc",
      dateFormat: "MM/DD/YYYY",
    },
  });
  
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      // Save to localStorage
      localStorage.setItem('profileSettings', JSON.stringify(data));
      
      // Update user profile in Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase
          .from('profiles')
          .update({ name: data.name })
          .eq('id', sessionData.session.user.id);
          
        if (error) throw error;
      }
      
      toast.success("Profile updated successfully!");
      console.log("Profile data:", data);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  const onNotificationsSubmit = (data: z.infer<typeof notificationsFormSchema>) => {
    try {
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(data));
      
      // Apply notification settings
      // In a real app, we would register or unregister push notifications,
      // update user preferences in the database, etc.
      
      toast.success("Notification settings updated!");
      console.log("Notifications data:", data);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to update notification settings");
    }
  };
  
  const onAppearanceSubmit = (data: z.infer<typeof appearanceFormSchema>) => {
    try {
      // Save to localStorage
      localStorage.setItem('appearanceSettings', JSON.stringify(data));
      
      // Apply theme immediately
      applyTheme(data.theme);
      
      // Apply other settings like bugsPerPage to local state/context
      // In a real app, we'd update a context that manages pagination, etc.
      
      toast.success("Appearance settings updated!");
      console.log("Appearance data:", data);
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast.error("Failed to update appearance settings");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account and application preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your email address for notifications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your full name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Role as read-only display */}
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm">
                        {userRole}
                      </div>
                      <FormDescription>
                        Your role determines your permissions in the system.
                      </FormDescription>
                    </FormItem>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Profile</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via email.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Push Notifications</FormLabel>
                          <FormDescription>
                            Receive push notifications in your browser.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={notificationsForm.control}
                      name="newBugNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>New Bug Reports</FormLabel>
                            <FormDescription>
                              When a new bug is reported.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="statusChangeNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Status Changes</FormLabel>
                            <FormDescription>
                              When a bug's status changes.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="commentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Comments</FormLabel>
                            <FormDescription>
                              When someone comments on a bug.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="assignmentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Assignments</FormLabel>
                            <FormDescription>
                              When a bug is assigned to you.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Notification Settings</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select your preferred theme.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="bugsPerPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bugs Per Page</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Number of bugs to show per page.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="defaultSort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Sort</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sort" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="createdAt-desc">Newest First</SelectItem>
                              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                              <SelectItem value="severity-desc">Severity (High-Low)</SelectItem>
                              <SelectItem value="severity-asc">Severity (Low-High)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Default sort order for bug lists.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Format</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Format for displaying dates.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Appearance Settings</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
