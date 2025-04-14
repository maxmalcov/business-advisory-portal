
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Plus, X } from 'lucide-react';
import type { User } from '../../hooks/types';

interface IframeUrlsSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const IframeUrlsSection: React.FC<IframeUrlsSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  const [newIframeUrl, setNewIframeUrl] = useState('');
  
  // Handle adding a new iframe URL
  const handleAddIframeUrl = () => {
    if (!newIframeUrl) return;
    
    // Ensure we're working with an array, even if iframeUrls is undefined
    const currentUrls = Array.isArray(user.iframeUrls) ? user.iframeUrls : [];
    
    onUserChange({
      ...user,
      iframeUrls: [...currentUrls, newIframeUrl]
    });
    
    setNewIframeUrl('');
  };

  // Handle removing an iframe URL
  const handleRemoveIframeUrl = (index: number) => {
    // Ensure we're working with an array, even if iframeUrls is undefined
    const currentUrls = Array.isArray(user.iframeUrls) ? [...user.iframeUrls] : [];
    
    if (currentUrls.length > index) {
      currentUrls.splice(index, 1);
      
      onUserChange({
        ...user,
        iframeUrls: currentUrls
      });
    }
  };

  // Ensure we're always displaying an array, even if iframeUrls is undefined
  const iframeUrls = Array.isArray(user.iframeUrls) ? user.iframeUrls : [];

  return (
    <div className="p-3 bg-gray-50 rounded-md mb-4">
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <Label className="text-sm font-medium text-gray-700">IFRAME URLs</Label>
      </div>
      
      <div className="space-y-2">
        {iframeUrls.map((url: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input 
              value={url}
              onChange={(e) => {
                if (isReadOnly) return;
                const newUrls = [...iframeUrls];
                newUrls[index] = e.target.value;
                onUserChange({...user, iframeUrls: newUrls});
              }}
              className="flex-grow h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/iframe-path"
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
            {!isReadOnly && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveIframeUrl(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        {!isReadOnly && (
          <div className="flex items-center gap-2 mt-3">
            <Input 
              placeholder="https://example.com/iframe-path"
              value={newIframeUrl}
              onChange={(e) => setNewIframeUrl(e.target.value)}
              className="flex-grow h-8 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddIframeUrl}
              className="h-8 whitespace-nowrap"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IframeUrlsSection;
