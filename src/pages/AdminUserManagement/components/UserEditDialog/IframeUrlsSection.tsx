
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Plus, X } from 'lucide-react';
import type { User } from '../../hooks/types';

interface IframeUrlsSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const IframeUrlsSection: React.FC<IframeUrlsSectionProps> = ({ user, onUserChange }) => {
  const [newIframeUrl, setNewIframeUrl] = useState('');
  
  useEffect(() => {
    console.log("IframeUrlsSection received user data:", { iframeUrls: user.iframeUrls });
  }, [user]);

  // Handle adding a new iframe URL
  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    onUserChange({
      ...user,
      iframeUrls: [...(user.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  // Handle removing an iframe URL
  const handleRemoveIframeUrl = (index: number) => {
    const newUrls = [...(user.iframeUrls || [])];
    newUrls.splice(index, 1);
    
    onUserChange({
      ...user,
      iframeUrls: newUrls
    });
  };

  return (
    <div className="space-y-4">
      <Label className="font-medium text-base">IFRAME URLs</Label>
      <div className="space-y-3">
        {user.iframeUrls?.map((url: string, index: number) => (
          <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
            <LinkIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <Input 
              value={url}
              onChange={(e) => {
                const newUrls = [...(user.iframeUrls || [])];
                newUrls[index] = e.target.value;
                onUserChange({...user, iframeUrls: newUrls});
              }}
              className="flex-grow border-gray-200"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleRemoveIframeUrl(index)}
              className="flex-shrink-0 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center gap-3 mt-4 p-3 border border-dashed border-gray-300 rounded-md">
          <LinkIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            placeholder="Add new URL"
            value={newIframeUrl}
            onChange={(e) => setNewIframeUrl(e.target.value)}
            className="flex-grow border-gray-200"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddIframeUrl}
            className="flex-shrink-0 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IframeUrlsSection;
