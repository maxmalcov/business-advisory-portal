import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usefulLinksTable, UsefulLinkDB } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import UsefulLinksList from './components/UsefulLinksList';
import UsefulLinksHeader from './components/UsefulLinksHeader';
import { UsefulLink } from './types';
import { Separator } from '@/components/ui/separator';

const UsefulLinks = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['useful-links'],
    queryFn: async () => {
      const { data, error } = await usefulLinksTable()
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // First convert to unknown then to our expected type to avoid TypeScript errors
      return data as unknown as UsefulLinkDB[];
    },
  });

  // Convert from database type to component type
  const links: UsefulLink[] = React.useMemo(() => {
    return data
      ? data.map((link) => ({
          id: link.id,
          title: link.title,
          description: link.description,
          url: link.url,
          category: link.category,
          icon: link.icon,
          display_order: link.display_order,
          created_at: link.created_at,
          updated_at: link.updated_at,
        }))
      : [];
  }, [data]);

  // Filter links by search query
  const filteredLinks = React.useMemo(() => {
    if (!searchQuery.trim()) return links;

    const query = searchQuery.toLowerCase().trim();
    return links.filter(
      (link) =>
        link.title.toLowerCase().includes(query) ||
        (link.description && link.description.toLowerCase().includes(query)) ||
        link.url.toLowerCase().includes(query) ||
        link.category.toLowerCase().includes(query),
    );
  }, [links, searchQuery]);

  // Get unique categories for tabs
  const categories = React.useMemo(() => {
    if (!links.length) return [];
    const uniqueCategories = [...new Set(links.map((link) => link.category))];
    return uniqueCategories;
  }, [links]);

  // Calculate filtered categories (only show categories that have matching links)
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const categoriesWithMatchingLinks = filteredLinks
      .map((link) => link.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    return categoriesWithMatchingLinks;
  }, [categories, filteredLinks, searchQuery]);

  // Add a special "all" tabId to handle showing all links
  const allTabId = 'all-categories';

  return (
    <div className="space-y-6">
      <UsefulLinksHeader />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('useful-links.search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card h-48 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive p-4 bg-destructive/10 rounded-md">
          {t('useful-links.error-loading')}
        </div>
      ) : filteredCategories.length > 0 ? (
        <Tabs defaultValue={allTabId}>
          <TabsList className="mb-6 flex flex-wrap h-auto p-1 gap-1">
            {/* All button - always shows first */}
            <TabsTrigger
              value={allTabId}
              className="px-4 py-2 flex items-center gap-1"
            >
              <ListFilter className="h-4 w-4" />
              {t('useful-links.table.all')}
            </TabsTrigger>

            {/* Category buttons */}
            {filteredCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2"
              >
                {t(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* "All" tab content */}
          <TabsContent value={allTabId}>
            <UsefulLinksList links={filteredLinks || []} />
          </TabsContent>

          {/* Individual category tab contents */}
          {filteredCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <UsefulLinksList
                links={
                  filteredLinks.filter((link) => link.category === category) ||
                  []
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : searchQuery ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            {t('useful-links.table.no-resources')}
          </p>
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            {t('useful-links.table.no-available-resources')}
          </p>
        </div>
      )}
    </div>
  );
};

export default UsefulLinks;
