
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UsefulLink } from '@/pages/UsefulLinks/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string().url('Please enter a valid URL'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
  display_order: z.coerce.number().int().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: UsefulLink;
  onSuccess: () => void;
}

// Common icons that might be useful for links
const iconOptions = [
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
const categoryOptions = [
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

const AddEditLinkDialog: React.FC<AddEditLinkDialogProps> = ({ 
  open, 
  onOpenChange, 
  mode, 
  initialData, 
  onSuccess 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
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
  
  const onSubmit = async (values: FormValues) => {
    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('useful_links')
          .insert([values]);
          
        if (error) throw error;
        
        toast({
          title: 'Link added',
          description: 'The link has been successfully added.',
        });
      } else {
        const { error } = await supabase
          .from('useful_links')
          .update(values)
          .eq('id', initialData?.id);
          
        if (error) throw error;
        
        toast({
          title: 'Link updated',
          description: 'The link has been successfully updated.',
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving link:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the link. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' 
              ? t('admin.useful_links.add_link') 
              : t('admin.useful_links.edit_link')
            }
          </DialogTitle>
          <DialogDescription>
            {t('admin.useful_links.dialog_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.useful_links.form.title')}</FormLabel>
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
                  <FormLabel>{t('admin.useful_links.form.description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    {t('admin.useful_links.form.description_help')}
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
                  <FormLabel>{t('admin.useful_links.form.url')}</FormLabel>
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
                  <FormLabel>{t('admin.useful_links.form.category')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.useful_links.form.select_category')} />
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
                  <FormLabel>{t('admin.useful_links.form.icon')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.useful_links.form.select_icon')} />
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
                    {t('admin.useful_links.form.icon_help')}
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
                  <FormLabel>{t('admin.useful_links.form.display_order')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || 0} />
                  </FormControl>
                  <FormDescription>
                    {t('admin.useful_links.form.display_order_help')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {mode === 'add' 
                  ? t('admin.useful_links.add_button') 
                  : t('admin.useful_links.update_button')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLinkDialog;
