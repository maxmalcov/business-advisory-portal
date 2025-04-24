
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IframeSubscription } from '../../hooks/types';

interface SubscriptionItemProps {
  subscription: IframeSubscription;
  onToggleStatus: (id: string) => void;
  onUpdatePeriod: (id: string, startDate: Date, endDate?: Date, isLifetime?: boolean) => void;
  formatDate: (date?: Date) => string;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  onToggleStatus,
  onUpdatePeriod,
  formatDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(subscription.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(subscription.endDate);
  const [isLifetime, setIsLifetime] = useState(subscription.isLifetime);
  
  const handleSavePeriod = () => {
    if (startDate) {
      onUpdatePeriod(subscription.id, startDate, isLifetime ? undefined : endDate, isLifetime);
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setStartDate(subscription.startDate);
    setEndDate(subscription.endDate);
    setIsLifetime(subscription.isLifetime);
    setIsEditing(false);
  };
  
  return (
    <div className="mb-4 border rounded-md overflow-hidden">
      <div className="p-4 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{subscription.name}</span>
          <Badge 
            variant="outline" 
            className={subscription.status === 'active' 
              ? "bg-green-50 text-green-600 hover:bg-green-100" 
              : "bg-red-50 text-red-600 hover:bg-red-100"
            }
          >
            {subscription.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleStatus(subscription.id)}
            className={subscription.status === 'active' 
              ? "border-red-200 text-red-600 hover:bg-red-50" 
              : "border-green-200 text-green-600 hover:bg-green-50"
            }
          >
            {subscription.status === 'active' ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Activate
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={subscription.status !== 'active'}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Period
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="p-4 border-t bg-muted/10">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1/2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="isLifetime">Lifetime Subscription</Label>
                  <Switch 
                    id="isLifetime" 
                    checked={isLifetime}
                    onCheckedChange={setIsLifetime}
                  />
                </div>
                
                {!isLifetime && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick an end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSavePeriod}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className="font-medium flex items-center">
              {subscription.status === 'active' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Active
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Inactive
                </>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">URL</div>
            <div className="font-medium text-sm truncate">
              {subscription.url || 'No URL configured'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">Start Date</div>
            <div className="font-medium">
              {formatDate(subscription.startDate)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">End Date</div>
            <div className="font-medium">
              {subscription.isLifetime 
                ? "Lifetime (No expiration)" 
                : formatDate(subscription.endDate)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionItem;

