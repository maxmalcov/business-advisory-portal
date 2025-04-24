import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}
const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel
}) => {
  const {
    t
  } = useLanguage();
  return <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onCancel}>
        {t('app.cancel')}
      </Button>
      <Button type="submit" disabled={isSubmitting} className="px-[7px]">
        {isSubmitting ? t('app.loading') : t('app.submit')}
      </Button>
    </div>;
};
export default FormActions;