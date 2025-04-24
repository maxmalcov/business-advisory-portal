
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SubscriptionPeriodEditorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isLifetime: boolean;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onLifetimeChange: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SubscriptionPeriodEditor: React.FC<SubscriptionPeriodEditorProps> = ({
  startDate,
  endDate,
  isLifetime,
  onStartDateChange,
  onEndDateChange,
  onLifetimeChange,
  onSave,
  onCancel,
}) => {
  return (
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
                  onSelect={onStartDateChange}
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
                onCheckedChange={onLifetimeChange}
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
                    onSelect={onEndDateChange}
                    initialFocus
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPeriodEditor;
