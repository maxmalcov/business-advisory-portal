
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import type { User } from '../../hooks/types';

interface IframeUrlsSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly: boolean;
}

const IframeUrlsSection: React.FC<IframeUrlsSectionProps> = ({
  user,
  onUserChange,
  isReadOnly,
}) => {
  const [newIframeUrl, setNewIframeUrl] = useState('');
  const iframeUrls = user.iframeUrls || [];

  const handleAddIframeUrl = () => {
    if (!newIframeUrl.trim()) return;
    
    const updatedUser = {
      ...user,
      iframeUrls: [...iframeUrls, newIframeUrl.trim()]
    };
    
    onUserChange(updatedUser);
    setNewIframeUrl('');
  };

  const handleRemoveIframeUrl = (index: number) => {
    const updatedIframeUrls = [...iframeUrls];
    updatedIframeUrls.splice(index, 1);
    
    const updatedUser = {
      ...user,
      iframeUrls: updatedIframeUrls
    };
    
    onUserChange(updatedUser);
  };

  const handleIframeUrlChange = (index: number, value: string) => {
    const updatedIframeUrls = [...iframeUrls];
    updatedIframeUrls[index] = value;
    
    const updatedUser = {
      ...user,
      iframeUrls: updatedIframeUrls
    };
    
    onUserChange(updatedUser);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">IFRAME URLs</h3>
      </div>
      
      <div className="space-y-3">
        {iframeUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => handleIframeUrlChange(index, e.target.value)}
              className="flex-1"
              disabled={isReadOnly}
            />
            {!isReadOnly && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveIframeUrl(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        {!isReadOnly && (
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Add new URL"
              value={newIframeUrl}
              onChange={(e) => setNewIframeUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddIframeUrl}
              disabled={!newIframeUrl.trim()}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        )}
        
        {iframeUrls.length === 0 && (
          <div className="text-sm text-muted-foreground italic text-center">
            No iframe URLs added.
          </div>
        )}
      </div>
    </div>
  );
};

export default IframeUrlsSection;

