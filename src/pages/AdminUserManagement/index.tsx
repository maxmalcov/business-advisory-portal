
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';

// Import the components
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditDialog from './components/UserEditDialog';
import AddUserDialog from './components/AddUserDialog';

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
}

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Map database fields to our User interface
          const mappedUsers: User[] = data.map(profile => ({
            id: profile.id,
            name: profile.full_name || '',
            email: profile.email,
            companyName: profile.company_name || '',
            userType: profile.user_type,
            incomingInvoiceEmail: profile.incoming_invoice_email || '',
            outgoingInvoiceEmail: profile.outgoing_invoice_email || '',
            iframeUrls: profile.iframe_urls || []
          }));
          
          setUsers(mappedUsers);
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load users',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle user edit
  const handleEditUser = (user: User) => {
    setEditingUser({...user});
  };

  // Handle user update
  const handleUpdateUser = (updatedUser: User) => {
    setEditingUser(updatedUser);
  };

  // Save edited user
  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Map our User interface back to database fields
      const profileData = {
        full_name: editingUser.name,
        company_name: editingUser.companyName,
        user_type: editingUser.userType,
        incoming_invoice_email: editingUser.incomingInvoiceEmail,
        outgoing_invoice_email: editingUser.outgoingInvoiceEmail,
        iframe_urls: editingUser.iframeUrls
      };
      
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', editingUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `${editingUser.name}'s details have been updated successfully.`,
      });
      
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update user details',
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Open add user dialog
  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  // Cancel adding user
  const handleCancelAddUser = () => {
    setIsAddingUser(false);
  };

  // Save new user
  const handleSaveNewUser = async (newUser: Omit<User, 'id'>) => {
    try {
      // In a real implementation, this would trigger a backend API call
      // to create a new user in the auth system
      // For now, we'll just add to the local state
      const userToAdd: User = {
        id: `temp-${Date.now()}`, // In real app, this would come from the backend
        ...newUser
      };
      
      setUsers([...users, userToAdd]);
      
      toast({
        title: "User Created",
        description: `${newUser.name} has been added successfully.`,
      });
      
      setIsAddingUser(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message || 'Failed to create new user',
      });
    }
  };

  return (
    <div className="space-y-6">
      <UserManagementHeader />
      
      <UserSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch}
        onAddUser={handleAddUser}
      />

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p>Loading users...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <UserTable 
              users={filteredUsers} 
              onEditUser={handleEditUser}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => {
        if (!open) setEditingUser(null);
      }}>
        {editingUser && (
          <UserEditDialog
            user={editingUser}
            onUserChange={handleUpdateUser}
            onSave={handleSaveUser}
            onCancel={handleCancelEdit}
          />
        )}
      </Dialog>

      {/* Add User Dialog */}
      <Dialog 
        open={isAddingUser} 
        onOpenChange={(open) => {
          setIsAddingUser(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <AddUserDialog 
            onSave={handleSaveNewUser}
            onCancel={handleCancelAddUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
