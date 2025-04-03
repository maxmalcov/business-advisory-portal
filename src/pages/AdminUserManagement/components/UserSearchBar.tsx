
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddUser: () => void; // Function to handle adding a new user
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ 
  searchQuery, 
  onSearchChange,
  onAddUser 
}) => {
  console.log("UserSearchBar rendering, onAddUser:", !!onAddUser); // Debug log
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <Button 
        onClick={() => {
          console.log("Add User button clicked"); // Debug log
          onAddUser();
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New User
      </Button>
    </div>
  );
};

export default UserSearchBar;
