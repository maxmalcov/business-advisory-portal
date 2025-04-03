
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { AlertCircle } from 'lucide-react';
import { SubscriptionTool } from '@/types/subscriptions';

interface SubscriptionSheetContentProps {
  selectedTool: SubscriptionTool | null;
  onRequestAccess: () => void;
}

const SubscriptionSheetContent: React.FC<SubscriptionSheetContentProps> = ({ 
  selectedTool,
  onRequestAccess
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto">
      <SheetHeader className="mb-4">
        <SheetTitle className="flex items-center">
          {selectedTool?.icon && <div className="mr-2">{selectedTool.icon}</div>}
          {selectedTool?.name}
          <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedTool ? getStatusBadgeClass(selectedTool.status) : ''}`}>
            {selectedTool?.status.charAt(0).toUpperCase() + selectedTool?.status.slice(1)}
          </div>
        </SheetTitle>
        <SheetDescription>
          {selectedTool?.description}
        </SheetDescription>
      </SheetHeader>

      {selectedTool?.status === 'active' && selectedTool.iframeUrl ? (
        <iframe
          src={selectedTool.iframeUrl}
          className="w-full h-[calc(100vh-150px)] border-0 rounded"
          title={selectedTool.name}
          allowFullScreen
        />
      ) : (
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-yellow-50 flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Subscription Required</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {selectedTool?.status === 'pending' 
                  ? 'Your access request is pending approval.' 
                  : selectedTool?.status === 'rejected'
                    ? 'Your access request has been rejected. Please contact support for more information.'
                    : 'You need to subscribe to access this tool.'}
              </p>
            </div>
          </div>

          <div className="aspect-video bg-black rounded overflow-hidden">
            <iframe
              src={selectedTool?.demoVideoUrl}
              className="w-full h-full border-0"
              title={`${selectedTool?.name} Demo`}
              allowFullScreen
            />
          </div>
          
          <div className="flex justify-end">
            {(selectedTool?.status === 'inactive' || selectedTool?.status === 'rejected') && (
              <Button onClick={onRequestAccess}>
                Request Access
              </Button>
            )}
          </div>
        </div>
      )}
    </SheetContent>
  );
};

export default SubscriptionSheetContent;
