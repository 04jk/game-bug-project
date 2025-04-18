
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BugSeverity } from '@/types/bug';
import { addBug, currentUser } from '@/data/mockData';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  stepsToReproduce: z.string().min(10, {
    message: "Steps to reproduce must be at least 10 characters.",
  }),
  severity: z.nativeEnum(BugSeverity),
  gameArea: z.string().min(1, {
    message: "Game area is required.",
  }),
  platform: z.string().min(1, {
    message: "Platform is required.",
  }),
});

const NewBug = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      stepsToReproduce: "",
      severity: BugSeverity.MEDIUM,
      gameArea: "",
      platform: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newBug = addBug({
      ...values,
      reportedBy: currentUser.name,
      status: "New", // BugStatus.NEW but as string to match enum
    });
    
    toast.success("Bug reported successfully!");
    navigate(`/bug/${newBug.id}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold">Report New Bug</h1>
        <p className="text-gray-500">Fill in the details to report a new bug</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bug Details</CardTitle>
          <CardDescription>Provide as much detail as possible to help with bug fixing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bug Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the bug" {...field} />
                    </FormControl>
                    <FormDescription>
                      Keep it short but descriptive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(BugSeverity).map(severity => (
                            <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How critical is this bug?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gameArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Area</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select game area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["UI/UX", "Controls", "Graphics", "Audio", "Gameplay", "Networking", "Performance", "AI"].map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Which part of the game is affected?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "All Platforms"].map(platform => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        On which platform does the bug occur?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the bug..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what happens and how it affects the game
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stepsToReproduce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps to Reproduce</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the exact steps needed to reproduce the bug..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Step-by-step instructions to reproduce the bug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/bugs')}>
                  Cancel
                </Button>
                <Button type="submit">Submit Bug Report</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBug;
