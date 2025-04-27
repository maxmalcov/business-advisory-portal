
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
} from 'lucide-react';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface LogsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
}

const LogsFilters: React.FC<LogsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  levelFilter,
  onLevelChange,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const {t} = useLanguage()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('logs.search.placeholder')}
          className="pl-8"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="flex items-center">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('logs.categories')}</SelectItem>
              <SelectItem value="user">{t('logs.user')}</SelectItem>
              <SelectItem value="email">{t('logs.email')}</SelectItem>
              <SelectItem value="service">{t('logs.service')}</SelectItem>
              <SelectItem value="invoice">{t('logs.invoice')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/*<div className="flex items-center">*/}
        {/*  <Select value={levelFilter} onValueChange={onLevelChange}>*/}
        {/*    <SelectTrigger className="w-[140px]">*/}
        {/*      <Filter className="mr-2 h-4 w-4" />*/}
        {/*      <SelectValue placeholder="Level" />*/}
        {/*    </SelectTrigger>*/}
        {/*    <SelectContent>*/}
        {/*      <SelectItem value="all">All Levels</SelectItem>*/}
        {/*      <SelectItem value="info">Info</SelectItem>*/}
        {/*      <SelectItem value="warning">Warning</SelectItem>*/}
        {/*      <SelectItem value="error">Error</SelectItem>*/}
        {/*    </SelectContent>*/}
        {/*  </Select>*/}
        {/*</div>*/}
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t('logs.export')}
        </Button>
      </div>
    </div>
  );
};

export default LogsFilters;
