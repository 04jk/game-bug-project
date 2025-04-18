
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BugStatus } from '@/types/bug';
import { addBug, currentUser } from '@/data/mockData';
import { toast } from 'sonner';
import { BugMetadataFields } from '@/components/bug-form/BugMetadataFields';
import { BugDescriptionFields } from '@/components/bug-form/BugDescriptionFields';
import { bugFormSchema, type BugFormData } from '@/schemas/bugFormSchema';

const NewBug = () => {
  const navigate = useNavigate();
  
  const form = useForm<BugFormData>({
    resolver: zodResolver(bugFormSchema),
    defaultValues: {
      title: "",
      description: "",
      stepsToReproduce: "",
      severity: undefined,
      gameArea: "",
      platform: "",
    },
  });
  
  const onSubmit = (values: BugFormData) => {
    // Since the form validation ensures all fields are defined,
    // we can safely pass them to addBug as non-optional values
    const newBug = addBug({
      title: values.title,
      description: values.description,
      stepsToReproduce: values.stepsToReproduce,
      severity: values.severity,
      gameArea: values.gameArea,
      platform: values.platform,
      reportedBy: currentUser.name,
      status: BugStatus.NEW,
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
              <BugDescriptionFields form={form} />
              <BugMetadataFields form={form} />
              
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
