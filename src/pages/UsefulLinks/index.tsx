
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usefulLinksTable, UsefulLinkDB } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsefulLinksList from './components/UsefulLinksList';
import UsefulLinksHeader from './components/UsefulLinksHeader';
import { UsefulLink } from './types';

const UsefulLinks = () => {
  const { t } = useLanguage();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['useful-links'],
    queryFn: async () => {
      const { data, error } = await usefulLinksTable()
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as UsefulLinkDB[];
    }
  });

  // Convert from database type to component type
  const links: UsefulLink[] = React.useMemo(() => {
    return data ? data.map(link => ({
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category,
      icon: link.icon,
      display_order: link.display_order,
      created_at: link.created_at,
      updated_at: link.updated_at
    })) : [];
  }, [data]);

  // Get unique categories for tabs
  const categories = React.useMemo(() => {
    if (!links.length) return [];
    const uniqueCategories = [...new Set(links.map(link => link.category))];
    return uniqueCategories;
  }, [links]);

  return (
    <div className="space-y-6">
      <UsefulLinksHeader />
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card h-40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive p-4 bg-destructive/10 rounded-md">
          {t('app.error_loading_data')}
        </div>
      ) : (
        categories.length > 0 ? (
          <Tabs defaultValue={categories[0]}>
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <UsefulLinksList 
                  links={links.filter(link => link.category === category) || []} 
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">{t('useful_links.no_links')}</p>
          </div>
        )
      )}
    </div>
  );
};

export default UsefulLinks;
