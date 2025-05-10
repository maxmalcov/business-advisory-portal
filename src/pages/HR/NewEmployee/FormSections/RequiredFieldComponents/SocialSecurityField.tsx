import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { HelpCircle } from 'lucide-react';
import { FormData, FormErrors } from '../../types';

interface SocialSecurityFieldProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const SocialSecurityField: React.FC<SocialSecurityFieldProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor="socialSecurityNumber" className="flex items-center">
          {t('hr.new_employee.ss_number')}{' '}
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <HoverCard>
          <HoverCardTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">
                Social Security Number Information
              </h4>
              <div className="text-sm">
                <p className="mb-2">
                  If you have an electronic certificate installed on your
                  computer, you can request a social security number at:
                </p>
                <a
                  href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Altas%2C+bajas+y+modificaciones/Altas+y+afiliacion+de+trabajadores/Solicitar+el+numero+de+la+Seguridad+Social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mb-2 break-words"
                >
                  Request Social Security Number
                </a>
                <p className="mb-2">
                  Or, if you already have it, you can check it here:
                </p>
                <a
                  href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Vida+laboral+e+informes/Informes+sobre+tu+situacion+laboral/Acreditacion_NUSS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block break-words"
                >
                  Check Existing Social Security Number
                </a>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Input
        id="socialSecurityNumber"
        name="socialSecurityNumber"
        value={formData.socialSecurityNumber}
        onChange={handleInputChange}
        className={errors.socialSecurityNumber ? 'border-red-500' : ''}
      />
      {errors.socialSecurityNumber && (
        <p className="text-sm text-red-500">{errors.socialSecurityNumber}</p>
      )}
      <p className="text-sm">
        <a
          href="https://www.seg-social.es/wps/portal/wss/internet/Trabajadores"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Visit Social Security website
        </a>
      </p>
    </div>
  );
};

export default SocialSecurityField;
