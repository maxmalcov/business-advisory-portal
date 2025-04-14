
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-8 bg-background text-foreground h-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default UserSearchBar;
