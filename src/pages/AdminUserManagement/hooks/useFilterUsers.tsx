
import { useState, useMemo } from 'react';
import { User } from './types';

export const useFilterUsers = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchQuery.toLowerCase() || '')
    );
  }, [users, searchQuery]);

  return {
    filteredUsers,
    searchQuery,
    setSearchQuery
  };
};
