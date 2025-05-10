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
  setComments,
}: AdditionalFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="additionalVacationDays">
          Additional vacation days to compensate
        </Label>
        <Input
          id="additionalVacationDays"
          type="number"
          min="0"
          value={additionalVacationDays}
          onChange={(e) => setAdditionalVacationDays(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="comments">Additional comments</Label>
        <Textarea
          id="comments"
          placeholder="Add any additional information here..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
    </>
  );
};

export default AdditionalFields;
