
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/user';
import { Tables } from '@/types/database.types';

interface ExportOption {
  id: string;
  label: string;
  field: string;
}

const exportOptions: ExportOption[] = [
  { id: 'id', label: 'User ID', field: 'id' },
  { id: 'name', label: 'Name', field: 'name' },
  { id: 'email', label: 'Email', field: 'email' },
  { id: 'role', label: 'Role', field: 'role' },
  { id: 'createdAt', label: 'Created At', field: 'created_at' },
  { id: 'lastSignIn', label: 'Last Sign In', field: 'last_sign_in_at' },
];

const ExportUsers = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'email', 'role']);
  const [open, setOpen] = useState(false);
  
  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };
  
  const exportToCSV = async () => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field to export");
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Fetch users from Supabase
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*') as { data: Tables['profiles']['Row'][] | null, error: any };
        
      if (error) {
        throw error;
      }
      
      // Since we can't directly access auth users through regular client
      // let's handle without admin API access for now
      // In a real app with proper permissions, we would fetch auth users
      
      // Combine data from profiles
      let users: any[] = profiles || [];
      
      // Add mock email for development if needed
      if (import.meta.env.DEV) {
        users = users.map(profile => ({
          ...profile,
          email: `${profile.name?.toLowerCase().replace(/\s+/g, '.')}@example.com` || 'unknown@example.com',
          last_sign_in_at: new Date().toISOString(),
        }));
      }
      
      // Filter fields based on selection
      const selectedOptions = exportOptions.filter(option => selectedFields.includes(option.id));
      
      // Create CSV header
      const header = selectedOptions.map(option => option.label).join(',');
      
      // Create CSV rows
      const rows = users.map(user => {
        return selectedOptions.map(option => {
          const value = user[option.field];
          // Handle special cases and ensure proper CSV formatting
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
          return value;
        }).join(',');
      });
      
      // Combine header and rows
      const csv = [header, ...rows].join('\n');
      
      // Download the CSV file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Users exported successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users");
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Users</DialogTitle>
          <DialogDescription>
            Select the fields you want to include in the CSV export.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {exportOptions.map(option => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`export-${option.id}`} 
                checked={selectedFields.includes(option.id)}
                onCheckedChange={() => toggleField(option.id)}
              />
              <Label htmlFor={`export-${option.id}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={exportToCSV} disabled={isExporting || selectedFields.length === 0}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportUsers;
