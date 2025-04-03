
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
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
import {
  Search,
  Filter,
  Download,
  Users,
  FileText,
  Mail,
  Upload,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Mock log data
const mockLogs = [
  {
    id: '1',
    action: 'User Registration',
    description: 'New user registered: client@example.com',
    timestamp: '2025-04-03T10:15:30Z',
    user: 'system',
    level: 'info',
    category: 'user'
  },
  {
    id: '2',
    action: 'File Upload',
    description: 'Invoice PDF uploaded by Jane Smith',
    timestamp: '2025-04-03T09:45:12Z',
    user: 'jane@company.com',
    level: 'info',
    category: 'file'
  },
  {
    id: '3',
    action: 'Email Sent',
    description: 'Monthly report sent to all clients',
    timestamp: '2025-04-03T08:30:00Z',
    user: 'system',
    level: 'info',
    category: 'email'
  },
  {
    id: '4',
    action: 'Login Attempt Failed',
    description: 'Failed login attempt for user: unknown@test.com',
    timestamp: '2025-04-02T23:12:45Z',
    user: 'unknown@test.com',
    level: 'warning',
    category: 'security'
  },
  {
    id: '5',
    action: 'Service Request',
    description: 'New HR Management service requested',
    timestamp: '2025-04-02T16:05:22Z',
    user: 'client@example.com',
    level: 'info',
    category: 'service'
  },
  {
    id: '6',
    action: 'System Error',
    description: 'Database connection failed temporarily',
    timestamp: '2025-04-02T14:30:54Z',
    user: 'system',
    level: 'error',
    category: 'system'
  },
  {
    id: '7',
    action: 'Settings Changed',
    description: 'User settings updated by administrator',
    timestamp: '2025-04-02T11:20:18Z',
    user: 'admin@businessadvisory.com',
    level: 'info',
    category: 'settings'
  },
  {
    id: '8',
    action: 'Invoice Generated',
    description: 'Monthly invoice #INV-2025-042 generated',
    timestamp: '2025-04-01T09:00:00Z',
    user: 'system',
    level: 'info',
    category: 'invoice'
  },
];

// Chart data
const chartData = [
  { name: 'User', value: 42 },
  { name: 'File', value: 65 },
  { name: 'Email', value: 120 },
  { name: 'Security', value: 15 },
  { name: 'Service', value: 28 },
  { name: 'System', value: 9 },
  { name: 'Invoice', value: 54 },
];

const weeklyData = [
  { name: 'Mon', users: 12, files: 19, emails: 35, security: 5 },
  { name: 'Tue', users: 8, files: 22, emails: 42, security: 3 },
  { name: 'Wed', users: 15, files: 14, emails: 28, security: 4 },
  { name: 'Thu', users: 9, files: 10, emails: 32, security: 2 },
  { name: 'Fri', users: 7, files: 18, emails: 25, security: 1 },
  { name: 'Sat', users: 3, files: 5, emails: 12, security: 0 },
  { name: 'Sun', users: 2, files: 4, emails: 8, security: 0 },
];

const getLogIcon = (category: string) => {
  switch (category) {
    case 'user':
      return <Users className="h-4 w-4" />;
    case 'file':
      return <FileText className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'security':
      return <AlertTriangle className="h-4 w-4" />;
    case 'service':
      return <Settings className="h-4 w-4" />;
    case 'invoice':
      return <FileText className="h-4 w-4" />;
    case 'system':
      return <Settings className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getLogBadgeStyle = (level: string) => {
  switch (level) {
    case 'info':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'error':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const AdminLogs: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-ba-blue">
        <CardHeader>
          <CardTitle className="text-2xl">System Log History</CardTitle>
          <CardDescription>
            Detailed log of all system activity and events
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="logs">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Log Entries</TabsTrigger>
          <TabsTrigger value="statistics">Visual Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs" className="space-y-4">
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                <Select value={levelFilter} onValueChange={setLevelFilter}>
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
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="bg-muted p-1.5 rounded-md inline-flex">
                          {getLogIcon(log.category)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getLogBadgeStyle(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Category</CardTitle>
                <CardDescription>Total events per category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Events" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Events distribution over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" name="User Events" fill="#8884d8" />
                      <Bar dataKey="files" name="File Events" fill="#82ca9d" />
                      <Bar dataKey="emails" name="Email Events" fill="#ffc658" />
                      <Bar dataKey="security" name="Security Events" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Activity Summary</CardTitle>
              <CardDescription>Key statistics about system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-700">42</div>
                  <div className="text-sm text-blue-600">User Events</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <div className="text-2xl font-bold text-green-700">65</div>
                  <div className="text-sm text-green-600">File Uploads</div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <Mail className="mx-auto mb-2 h-8 w-8 text-amber-600" />
                  <div className="text-2xl font-bold text-amber-700">120</div>
                  <div className="text-sm text-amber-600">Emails Sent</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-600" />
                  <div className="text-2xl font-bold text-red-700">15</div>
                  <div className="text-sm text-red-600">Security Events</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLogs;
