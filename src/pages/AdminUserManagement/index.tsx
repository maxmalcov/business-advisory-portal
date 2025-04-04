
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
import { mockUsers } from './mockData';
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
}

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

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
          iframeUrls: [] // This may need to be added to the profiles table
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
        title: 'Ошибка',
        description: 'Не удалось загрузить пользователей'
      });
      // Fall back to mock data if Supabase fetch fails
      setUsers(mockUsers);
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
        title: "Пользователь обновлен",
        description: `Данные пользователя ${editingUser.name} были успешно обновлены.`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка обновления',
        description: 'Произошла ошибка при обновлении пользователя.',
      });
    } finally {
      setEditingUser(null);
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
        title: "Пользователь создан",
        description: `${newUser.name} был успешно добавлен.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка создания',
        description: 'Произошла ошибка при создании пользователя.',
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
              <p>Загрузка пользователей...</p>
            </div>
          ) : (
            <UserTable 
              users={filteredUsers} 
              onEditUser={handleEditUser}
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
    </div>
  );
};

export default AdminUserManagement;
