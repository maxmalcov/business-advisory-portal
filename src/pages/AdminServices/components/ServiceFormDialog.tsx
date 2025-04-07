
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from '@/integrations/supabase/client';

interface ServiceFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  service: Service | null;
  onSave: (serviceData: Partial<Service>) => void;
  categories: string[];
}

const serviceFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  isOpen,
  setIsOpen,
  service,
  onSave,
  categories
}) => {
  const isEditing = !!service;
  const dialogTitle = isEditing ? 'Edit Service' : 'Create New Service';
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      price: service?.price || 0,
      category: service?.category || '',
      status: service?.status || 'active'
    }
  });
  
  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };
  
  const onSubmit = (data: ServiceFormValues) => {
    onSave(data);
    form.reset();
  };

  // Reset form when service changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: service?.title || '',
        description: service?.description || '',
        price: service?.price || 0,
        category: service?.category || '',
        status: service?.status || 'active'
      });
    }
  }, [form, service, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of this service."
              : "Add a new service to offer to your clients."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service title" {...field} />
                  </FormControl>
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
                      placeholder="Enter service description" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Price in USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Option to clear category */}
                      <SelectItem value="">No Category</SelectItem>
                      
                      {/* Fixed categories */}
                      <SelectItem value="Tax">Tax</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Accounting">Accounting</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      
                      {/* Dynamic categories from existing services */}
                      {categories
                        .filter(cat => !['Tax', 'Legal', 'Finance', 'Accounting', 'Consulting'].includes(cat))
                        .map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Inactive services won't be shown to clients.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Service' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
