
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BugSeverity } from '@/types/bug';
import { UseFormReturn } from 'react-hook-form';
import { BugFormData } from '@/schemas/bugFormSchema';

interface BugMetadataFieldsProps {
  form: UseFormReturn<BugFormData>;
}

const GAME_AREAS = ["UI/UX", "Controls", "Graphics", "Audio", "Gameplay", "Networking", "Performance", "AI"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "All Platforms"];

export function BugMetadataFields({ form }: BugMetadataFieldsProps) {
  return (
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
            <FormDescription>How critical is this bug?</FormDescription>
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
                {GAME_AREAS.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Which part of the game is affected?</FormDescription>
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
                {PLATFORMS.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>On which platform does the bug occur?</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
