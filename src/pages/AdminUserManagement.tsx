
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  UserCog,
  X,
  Plus,
  Save,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

// Define user interface for admin management
interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  user_type: string;
  incoming_invoice_email: string | null;
  outgoing_invoice_email: string | null;
  iframe_urls: string[] | null;
}

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newIframeUrl, setNewIframeUrl] = useState('');

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setUsers(data as UserProfile[]);
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
    
    if (currentUser?.userType === 'admin') {
      fetchUsers();
    }
  }, [currentUser, toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user: UserProfile) => {
    setEditingUser({...user});
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingUser.full_name,
          company_name: editingUser.company_name,
          user_type: editingUser.user_type,
          incoming_invoice_email: editingUser.incoming_invoice_email,
          outgoing_invoice_email: editingUser.outgoing_invoice_email,
          iframe_urls: editingUser.iframe_urls
        })
        .eq('id', editingUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `${editingUser.full_name}'s details have been updated successfully.`,
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

  const handleAddIframeUrl = () => {
    if (!newIframeUrl || !editingUser) return;
    
    setEditingUser({
      ...editingUser,
      iframe_urls: [...(editingUser.iframe_urls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  const handleRemoveIframeUrl = (index: number) => {
    if (!editingUser) return;
    
    const newUrls = [...(editingUser.iframe_urls || [])];
    newUrls.splice(index, 1);
    
    setEditingUser({
      ...editingUser,
      iframe_urls: newUrls
    });
  };

  const handleChangeUserType = (value: string) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      user_type: value
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-2xl">User Management</CardTitle>
          <CardDescription>
            View and manage user accounts
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.user_type}</span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit User Details</DialogTitle>
                          <DialogDescription>
                            Update the user's information and settings
                          </DialogDescription>
                        </DialogHeader>
                        
                        {editingUser && (
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input 
                                id="name"
                                value={editingUser.full_name || ''}
                                onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email"
                                value={editingUser.email}
                                disabled
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="company">Company Name</Label>
                              <Input 
                                id="company"
                                value={editingUser.company_name || ''}
                                onChange={(e) => setEditingUser({...editingUser, company_name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select 
                                value={editingUser.user_type} 
                                onValueChange={handleChangeUserType}
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="incoming-email">Email for Incoming Invoices</Label>
                              <div className="flex">
                                <Mail className="mr-2 h-4 w-4 mt-2.5" />
                                <Input 
                                  id="incoming-email"
                                  value={editingUser.incoming_invoice_email || ''}
                                  onChange={(e) => setEditingUser({...editingUser, incoming_invoice_email: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
                              <div className="flex">
                                <Mail className="mr-2 h-4 w-4 mt-2.5" />
                                <Input 
                                  id="outgoing-email"
                                  value={editingUser.outgoing_invoice_email || ''}
                                  onChange={(e) => setEditingUser({...editingUser, outgoing_invoice_email: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="col-span-2 space-y-2">
                              <Label>IFRAME URLs</Label>
                              <div className="space-y-2">
                                {editingUser.iframe_urls?.map((url, index) => (
                                  <div key={index} className="flex items-center">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    <Input 
                                      value={url}
                                      onChange={(e) => {
                                        const newUrls = [...(editingUser.iframe_urls || [])];
                                        newUrls[index] = e.target.value;
                                        setEditingUser({...editingUser, iframe_urls: newUrls});
                                      }}
                                      className="flex-grow"
                                    />
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRemoveIframeUrl(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                
                                <div className="flex items-center mt-2">
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  <Input 
                                    placeholder="Add new URL"
                                    value={newIframeUrl}
                                    onChange={(e) => setNewIframeUrl(e.target.value)}
                                    className="flex-grow"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleAddIframeUrl}
                                    className="ml-2"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                          <Button onClick={handleSaveUser}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
