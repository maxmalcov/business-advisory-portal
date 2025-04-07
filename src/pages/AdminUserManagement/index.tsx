
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

// Import the components
import UserManagementHeader from './components/UserManagementHeader';
import UserSearchBar from './components/UserSearchBar';
import UserTable from './components/UserTable';
import UserEditDialog from './components/UserEditDialog';
import AddUserDialog from './components/AddUserDialog';
import { AppUser } from '@/context/AuthContext';

// Define the User type for the admin panel
interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: string;
  incomingInvoiceEmail?: string;
  outgoingInvoiceEmail?: string;
  iframeUrls?: string[];
  isActive?: boolean;
}

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Fetched profiles data:", data);
        // Transform the profiles data to match our User interface
        const transformedUsers: User[] = data.map(profile => ({
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          companyName: profile.companyname,
          userType: profile.usertype || 'client',
          incomingInvoiceEmail: profile.incominginvoiceemail,
          outgoingInvoiceEmail: profile.outgoinginvoiceemail,
          iframeUrls: [], // This may need to be added to the profiles table
          isActive: true // Assuming all users are active by default
        }));
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log("No data returned from Supabase");
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users'
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase() || '')
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
      console.log("Updating user in Supabase:", editingUser);
      // Update the user in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingUser.name,
          email: editingUser.email,
          usertype: editingUser.userType,
          companyname: editingUser.companyName,
          incominginvoiceemail: editingUser.incomingInvoiceEmail,
          outgoinginvoiceemail: editingUser.outgoingInvoiceEmail
          // Note: iframeUrls may need to be added to the profiles table
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `User ${editingUser.name} was successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: 'An error occurred while updating the user.',
      });
    } finally {
      setEditingUser(null);
    }
  };

  // Handle user deletion
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Delete the user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );
      
      if (authError) {
        console.error('Error deleting user from Auth:', authError);
        // Try to delete from profiles table anyway
      }
      
      // Delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

      // Update local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: "User Deleted",
        description: `User ${userToDelete.name} was successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Error',
        description: 'An error occurred while deleting the user.',
      });
    } finally {
      setUserToDelete(null);
      setShowConfirmDelete(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, isActive: !user.isActive };
    
    try {
      // In a real implementation, you would update user status in Supabase
      // For this example, we're just updating the local state
      
      // Update local state
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      toast({
        title: updatedUser.isActive ? "User Activated" : "User Deactivated",
        description: `${user.name}'s status was successfully changed.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        variant: 'destructive',
        title: 'Status Update Error',
        description: 'An error occurred while changing the user status.',
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
      console.log("Creating new user:", newUser);
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'tempPassword123', // This should be provided by the user in a real app
        options: {
          data: {
            name: newUser.name,
            userType: newUser.userType,
            companyName: newUser.companyName,
            incomingInvoiceEmail: newUser.incomingInvoiceEmail,
            outgoingInvoiceEmail: newUser.outgoingInvoiceEmail
          }
        }
      });
      
      if (authError) throw authError;
      console.log("User created in Auth:", authData);

      // Fetch users again to update the list
      await fetchUsers();
      
      toast({
        title: "User Created",
        description: `${newUser.name} was successfully added.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Error',
        description: 'An error occurred while creating the user.',
      });
    } finally {
      setIsAddingUser(false);
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

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Loading users...</p>
            </div>
          ) : (
            <UserTable 
              users={filteredUsers} 
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={toggleUserStatus}
            />
          )}
        </CardContent>
      </Card>

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
        <AddUserDialog 
          onSave={handleSaveNewUser}
          onCancel={handleCancelAddUser}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showConfirmDelete} 
        onOpenChange={(open) => {
          setShowConfirmDelete(open);
          if (!open) setUserToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete user {userToDelete?.name}?</p>
            <p className="text-destructive">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90"
                onClick={confirmDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
