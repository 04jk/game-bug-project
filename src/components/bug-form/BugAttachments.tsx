
import React, { useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Paperclip, FileImage, FileVideo, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BugAttachmentsProps {
  form: UseFormReturn<any>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

export function BugAttachments({ form }: BugAttachmentsProps) {
  const attachments = form.watch('attachments') || [];

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('bug-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('bug-attachments')
        .getPublicUrl(filePath);

      const newAttachment = {
        url: publicUrl,
        type: file.type,
        name: file.name
      };

      const currentAttachments = form.getValues('attachments') || [];
      form.setValue('attachments', [...currentAttachments, newAttachment]);
      
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    }
  }, [form]);

  const removeAttachment = (index: number) => {
    const currentAttachments = [...attachments];
    currentAttachments.splice(index, 1);
    form.setValue('attachments', currentAttachments);
  };

  return (
    <FormField
      control={form.control}
      name="attachments"
      render={() => (
        <FormItem>
          <FormLabel>Attachments</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {attachments.map((attachment: any, index: number) => (
                  <div key={index} className="relative group">
                    {attachment.type.startsWith('image/') ? (
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg border">
                        <FileVideo className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept={ALLOWED_FILE_TYPES.join(',')}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Add Attachment
                </Button>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Upload images or videos (max 5MB each). Supported formats: JPEG, PNG, GIF, MP4, MOV
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
