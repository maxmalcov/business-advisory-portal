
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
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
  // Initialize iframeUrls as an empty array if it's undefined
  const iframeUrls = user.iframeUrls || [];
  
  const handleAddIframeUrl = () => {
    const updatedUser = {
      ...user,
      iframeUrls: [...iframeUrls, '']
    };
    onUserChange(updatedUser);
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
        <h3 className="text-lg font-medium">Iframe URLs</h3>
        {!isReadOnly && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddIframeUrl}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add URL
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {iframeUrls.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            No iframe URLs added.
          </div>
        ) : (
          iframeUrls.map((url, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                {isReadOnly ? (
                  <div className="border rounded-md p-2 bg-muted text-sm truncate">
                    {url}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label htmlFor={`iframe-url-${index}`} className="sr-only">
                      Iframe URL {index + 1}
                    </Label>
                    <Input
                      id={`iframe-url-${index}`}
                      value={url}
                      onChange={(e) => handleIframeUrlChange(index, e.target.value)}
                      placeholder="https://example.com/iframe-content"
                      disabled={isReadOnly}
                    />
                  </div>
                )}
              </div>
              
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveIframeUrl(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IframeUrlsSection;
