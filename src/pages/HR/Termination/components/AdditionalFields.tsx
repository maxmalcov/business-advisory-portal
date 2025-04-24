
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalFieldsProps {
  additionalVacationDays: string;
  setAdditionalVacationDays: (value: string) => void;
  comments: string;
  setComments: (value: string) => void;
}

const AdditionalFields = ({
  additionalVacationDays,
  setAdditionalVacationDays,
  comments,
  setComments
}: AdditionalFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="additionalVacationDays">Additional vacation days</Label>
          <Input 
            id="additionalVacationDays"
            type="number"
            min="0"
            value={additionalVacationDays}
            onChange={e => setAdditionalVacationDays(e.target.value)}
            className="max-w-[200px]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comments">Additional comments</Label>
        <Textarea 
          id="comments"
          placeholder="Add any additional information about the termination..."
          value={comments}
          onChange={e => setComments(e.target.value)}
          className="h-32"
        />
      </div>
    </div>
  );
};

export default AdditionalFields;
