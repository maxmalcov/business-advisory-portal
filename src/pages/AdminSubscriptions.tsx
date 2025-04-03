
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Check, X, PackageOpen, Calendar, Users, Clock } from 'lucide-react';
import { initialSubscriptions } from './AdminSubscriptions/mockData';
import { Subscription } from './AdminSubscriptions/types';
import SubscriptionForm from './AdminSubscriptions/components/SubscriptionForm';

const AdminSubscriptions: React.FC = () => {
  const { t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleStatusChange = (subscriptionId: string, newStatus: 'active' | 'pending' | 'rejected' | 'inactive') => {
    setSubscriptions(prevSubscriptions => 
      prevSubscriptions.map(subscription => 
        subscription.id === subscriptionId 
          ? { ...subscription, status: newStatus } 
          : subscription
      )
    );

    toast.success(`Subscription status updated to ${newStatus}`);
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedSubscription(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (subscription: Subscription) => {
    if (isEditMode) {
      // Update existing subscription
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(item => 
          item.id === subscription.id 
            ? subscription 
            : item
        )
      );
      toast.success('Subscription updated successfully');
    } else {
      // Add new subscription
      const newSubscription = {
        ...subscription,
        id: `subscription-${Date.now()}`, // Generate a temporary ID
      };
      setSubscriptions(prevSubscriptions => [...prevSubscriptions, newSubscription]);
      toast.success('New subscription added successfully');
    }

    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSubscriptionIcon = (type: string) => {
    switch(type) {
      case 'iframe':
        return <PackageOpen className="h-5 w-5 text-primary" />;
      case 'calendar':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'crm':
        return <Users className="h-5 w-5 text-primary" />;
      case 'timetracking':
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <PackageOpen className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.subscriptions.title')}</h1>
        <Button onClick={handleAdd}>Add New Subscription</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getSubscriptionIcon(subscription.type)}
                    <span>{subscription.name}</span>
                  </div>
                </TableCell>
                <TableCell>{subscription.type}</TableCell>
                <TableCell>{subscription.userName}</TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell className="max-w-xs truncate">{subscription.url}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {subscription.status !== 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(subscription.id, 'active')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {subscription.status !== 'rejected' && subscription.status !== 'inactive' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(subscription.id, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(subscription)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Modify the subscription details below.' 
                : 'Fill in the details to add a new subscription.'}
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm 
            subscription={selectedSubscription} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptions;
