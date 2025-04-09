
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Plus, X } from 'lucide-react';
import type { User } from '../../hooks/types';

interface IframeUrlsSectionProps {
  newUser: Omit<User, 'id'>;
  onUserChange: (user: Omit<User, 'id'>) => void;
}

const IframeUrlsSection: React.FC<IframeUrlsSectionProps> = ({ newUser, onUserChange }) => {
  const [newIframeUrl, setNewIframeUrl] = useState('');

  // Handle adding a new iframe URL
  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    onUserChange({
      ...newUser,
      iframeUrls: [...(newUser.iframeUrls || []), newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  // Handle removing an iframe URL
  const handleRemoveIframeUrl = (index: number) => {
    const newUrls = [...(newUser.iframeUrls || [])];
    newUrls.splice(index, 1);
    
    onUserChange({
      ...newUser,
      iframeUrls: newUrls
    });
  };

  return (
    <div className="col-span-2 space-y-2">
      <Label>IFRAME URLs</Label>
      <div className="space-y-2">
        {newUser.iframeUrls?.map((url: string, index: number) => (
          <div key={index} className="flex items-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            <Input 
              value={url}
              onChange={(e) => {
                const newUrls = [...(newUser.iframeUrls || [])];
                newUrls[index] = e.target.value;
                onUserChange({...newUser, iframeUrls: newUrls});
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
  );
};

export default IframeUrlsSection;
