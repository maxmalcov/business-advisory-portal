
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { UsefulLink } from '@/pages/UsefulLinks/types';

// Common icons that might be useful for links
export const iconOptions = [
  { value: 'Building', label: 'Building' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Users', label: 'Users' },
  { value: 'FileText', label: 'Document' },
  { value: 'Globe', label: 'Website' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Mail', label: 'Email' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'CreditCard', label: 'Payment' },
  { value: 'Book', label: 'Book' },
  { value: 'MapPin', label: 'Location' },
  { value: 'Heart', label: 'Health' },
  { value: 'Landmark', label: 'Government' },
  { value: 'FileQuestion', label: 'Help' },
];

// Common categories for links
export const categoryOptions = [
  'Taxes',
  'Legal',
  'Social Security',
  'Employment',
  'Business',
  'Banking',
  'Health',
  'Education',
  'General',
];

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string().url('Please enter a valid URL'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
  display_order: z.coerce.number().int().optional(),
});

export type UsefulLinkFormValues = z.infer<typeof formSchema>;

interface UsefulLinkFormProps {
  initialData?: UsefulLink;
  onSubmit: (values: UsefulLinkFormValues) => Promise<void>;
  submitButtonText: string;
}

const UsefulLinkForm: React.FC<UsefulLinkFormProps> = ({ 
  initialData, 
  onSubmit,
  submitButtonText
}) => {
  const { t } = useLanguage();
  
  const form = useForm<UsefulLinkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      url: initialData?.url || '',
      category: initialData?.category || '',
      icon: initialData?.icon || '',
      display_order: initialData?.display_order || 0,
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                A brief description of what this link provides.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://" />
              </FormControl>
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
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose an icon that best represents this resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value || 0} />
              </FormControl>
              <FormDescription>
                Lower numbers will appear first in the list.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UsefulLinkForm;
