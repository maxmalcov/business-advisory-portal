
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '../../hooks/types';

interface IframeUrlsSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly: boolean;
}

const IframeUrlsSection: React.FC<IframeUrlsSectionProps> = ({
  user,
  onUserChange,
}) => {
  // Initialize iframeUrls as an empty array if it's undefined
  const iframeUrls = user.iframeUrls || [];
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');
  const [showAddField, setShowAddField] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleAddIframeUrl = () => {
    if (showAddField && newUrl.trim()) {
      const updatedIframeUrls = [...iframeUrls, newUrl.trim()];
      const updatedUser = {
        ...user,
        iframeUrls: updatedIframeUrls
      };
      onUserChange(updatedUser);
      setNewUrl('');
      setShowAddField(false);
      setHasChanges(true);
      toast({
        title: "URL Added",
        description: "The IFRAME URL has been added successfully.",
      });
    } else {
      setShowAddField(true);
    }
  };

  const handleRemoveIframeUrl = (index: number) => {
    const updatedIframeUrls = [...iframeUrls];
    updatedIframeUrls.splice(index, 1);
    
    const updatedUser = {
      ...user,
      iframeUrls: updatedIframeUrls
    };
    onUserChange(updatedUser);
    setHasChanges(true);
    toast({
      title: "URL Removed",
      description: "The IFRAME URL has been removed.",
    });
  };

  const handleIframeUrlChange = (index: number, value: string) => {
    const updatedIframeUrls = [...iframeUrls];
    updatedIframeUrls[index] = value;
    
    const updatedUser = {
      ...user,
      iframeUrls: updatedIframeUrls
    };
    onUserChange(updatedUser);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    toast({
      title: "Changes Saved",
      description: "All IFRAME URL changes have been saved.",
    });
    setHasChanges(false);
  };

  const handleCancelAdd = () => {
    setShowAddField(false);
    setNewUrl('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Iframe URLs</h3>
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
      </div>
      
      <div className="space-y-3">
        {iframeUrls.length === 0 && !showAddField ? (
          <div className="text-sm text-muted-foreground italic">
            No iframe URLs added.
          </div>
        ) : (
          <>
            {iframeUrls.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <div className="space-y-1">
                    <Label htmlFor={`iframe-url-${index}`} className="sr-only">
                      Iframe URL {index + 1}
                    </Label>
                    <Input
                      id={`iframe-url-${index}`}
                      value={url}
                      onChange={(e) => handleIframeUrlChange(index, e.target.value)}
                      placeholder="https://example.com/iframe-content"
                    />
                  </div>
                </div>
                
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
              </div>
            ))}
            
            {showAddField && (
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Enter new URL"
                    autoFocus
                  />
                </div>
                <Button
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={handleAddIframeUrl}
                  disabled={!newUrl.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAdd}
                >
                  <span className="sr-only">Cancel</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        
        {hasChanges && (
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSaveAll} 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IframeUrlsSection;
