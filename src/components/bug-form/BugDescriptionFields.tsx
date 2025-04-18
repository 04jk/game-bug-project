
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { BugFormData } from '@/schemas/bugFormSchema';

interface BugDescriptionFieldsProps {
  form: UseFormReturn<BugFormData>;
}

export function BugDescriptionFields({ form }: BugDescriptionFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bug Title</FormLabel>
            <FormControl>
              <Input placeholder="Brief description of the bug" {...field} />
            </FormControl>
            <FormDescription>Keep it short but descriptive</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <FormDescription>Explain what happens and how it affects the game</FormDescription>
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
            <FormDescription>Step-by-step instructions to reproduce the bug</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
