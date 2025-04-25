
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { useSubscriptionTypes } from './hooks/useSubscriptionTypes';
import SubscriptionTypeTable from './components/SubscriptionTypeTable';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionTypeDialog from '../AdminSubscriptions/components/SubscriptionTypeDialog';
import { toast } from '@/components/ui/use-toast';

const AdminSubscriptionCatalog: React.FC = () => {
  const { loading, subscriptionTypes, handleDelete, DeleteConfirmationDialog, createSubscriptionType } = useSubscriptionTypes();
  const [isTypeDialogOpen, setIsTypeDialogOpen] = React.useState(false);

  const handleAddNewTypeClick = () => {
    setIsTypeDialogOpen(true);
  };

  const handleSubscriptionTypeSubmit = async (data: any) => {
    try {
      console.log('Submitting subscription type data:', data);
      await createSubscriptionType(data);
      setIsTypeDialogOpen(false);
      toast({
        title: "Subscription Type Created",
        description: `Successfully created ${data.name} subscription type.`
      });
    } catch (error) {
      console.error('Error creating subscription type:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Layers className="h-6 w-6" />}
        title="Subscription Catalog"
        subtitle="Manage available subscription types"
      />
      
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Available Subscription Types</CardTitle>
          <Button 
            disabled={loading}
            onClick={handleAddNewTypeClick}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Subscription Type
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : subscriptionTypes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No subscription types found. Add your first subscription type!</p>
            </div>
          ) : (
            <SubscriptionTypeTable 
              subscriptionTypes={subscriptionTypes}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
      
      <SubscriptionTypeDialog
        isOpen={isTypeDialogOpen}
        onOpenChange={setIsTypeDialogOpen}
        onSubmit={handleSubscriptionTypeSubmit}
      />
      
      <DeleteConfirmationDialog />
    </div>
  );
};

export default AdminSubscriptionCatalog;
