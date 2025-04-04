
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Subscription } from '../../types';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  subscription: Subscription | null;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  subscription,
  onCancel,
  isSubmitting = false
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {subscription ? 'Saving...' : 'Adding...'}
          </>
        ) : (
          subscription ? 'Save Changes' : 'Add Subscription'
        )}
      </Button>
    </DialogFooter>
  );
};

export default FormActions;
