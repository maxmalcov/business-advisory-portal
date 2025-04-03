
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
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
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <Select value={levelFilter} onValueChange={onLevelChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>
    </div>
  );
};

export default LogsFilters;
