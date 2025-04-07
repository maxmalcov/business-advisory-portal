
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TerminationReasonSelectorProps {
  terminationReason: string;
  setTerminationReason: (value: string) => void;
}

export const reasonOptions = [
  { id: 'voluntary', name: 'Voluntary Resignation' },
  { id: 'performance', name: 'Performance Issues' },
  { id: 'redundancy', name: 'Redundancy' },
  { id: 'contract_end', name: 'End of Contract' },
  { id: 'other', name: 'Other' }
];

const TerminationReasonSelector = ({
  terminationReason,
  setTerminationReason
}: TerminationReasonSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="reason">{t('hr.termination.reason')}</Label>
      <Select 
        value={terminationReason}
        onValueChange={setTerminationReason}
      >
        <SelectTrigger id="reason">
          <SelectValue placeholder="Select a reason" />
        </SelectTrigger>
        <SelectContent>
          {reasonOptions.map(reason => (
            <SelectItem key={reason.id} value={reason.id}>
              {reason.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TerminationReasonSelector;
