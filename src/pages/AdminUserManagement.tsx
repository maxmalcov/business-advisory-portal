
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
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

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Example Client',
    email: 'client@example.com',
    companyName: 'Example SL',
    userType: 'client',
    incomingInvoiceEmail: 'invoices-in@example.com',
    outgoingInvoiceEmail: 'invoices-out@example.com',
    iframeUrls: ['https://example.com/iframe1', 'https://example.com/iframe2']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    companyName: 'Smith LLC',
    userType: 'client',
    incomingInvoiceEmail: 'invoices@smith.com',
    outgoingInvoiceEmail: 'sales@smith.com',
    iframeUrls: ['https://smith.com/dashboard']
  },
  {
    id: '3',
    name: 'Mark Johnson',
    email: 'mark@enterprise.com',
    companyName: 'Johnson Enterprise',
    userType: 'client',
    incomingInvoiceEmail: 'accounts@johnson.com',
    outgoingInvoiceEmail: 'billing@johnson.com',
    iframeUrls: []
  }
];

const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newIframeUrl, setNewIframeUrl] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user: any) => {
    setEditingUser({...user});
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    toast({
      title: "User Updated",
      description: `${editingUser.name}'s details have been updated successfully.`,
    });
    
    setEditingUser(null);
  };

  const handleAddIframeUrl = () => {
    if (!newIframeUrl || !editingUser) return;
    
    setEditingUser({
      ...editingUser,
      iframeUrls: [...(editingUser.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  const handleRemoveIframeUrl = (index: number) => {
    if (!editingUser) return;
    
    const newUrls = [...editingUser.iframeUrls];
    newUrls.splice(index, 1);
    
    setEditingUser({
      ...editingUser,
      iframeUrls: newUrls
    });
  };

  const handleChangeUserType = (value: string) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      userType: value
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-ba-blue">
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
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.companyName}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.userType}</span>
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
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="company">Company Name</Label>
                              <Input 
                                id="company"
                                value={editingUser.companyName || ''}
                                onChange={(e) => setEditingUser({...editingUser, companyName: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select 
                                value={editingUser.userType} 
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
                                  value={editingUser.incomingInvoiceEmail || ''}
                                  onChange={(e) => setEditingUser({...editingUser, incomingInvoiceEmail: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="outgoing-email">Email for Outgoing Invoices</Label>
                              <div className="flex">
                                <Mail className="mr-2 h-4 w-4 mt-2.5" />
                                <Input 
                                  id="outgoing-email"
                                  value={editingUser.outgoingInvoiceEmail || ''}
                                  onChange={(e) => setEditingUser({...editingUser, outgoingInvoiceEmail: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="col-span-2 space-y-2">
                              <Label>IFRAME URLs</Label>
                              <div className="space-y-2">
                                {editingUser.iframeUrls?.map((url: string, index: number) => (
                                  <div key={index} className="flex items-center">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    <Input 
                                      value={url}
                                      onChange={(e) => {
                                        const newUrls = [...editingUser.iframeUrls];
                                        newUrls[index] = e.target.value;
                                        setEditingUser({...editingUser, iframeUrls: newUrls});
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
