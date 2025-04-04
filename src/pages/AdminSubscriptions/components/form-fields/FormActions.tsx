
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Subscription } from '../../types';

interface FormActionsProps {
  subscription: Subscription | null;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  subscription,
  onCancel
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {subscription ? 'Save Changes' : 'Add Subscription'}
      </Button>
    </DialogFooter>
  );
};

export default FormActions;
