
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface UploadGuidelinesProps {
  maxFileSize?: number;
  maxFiles?: number;
  acceptedFormats?: string[];
  emailAddress?: string | null;
  emailType: 'incoming' | 'outgoing';
}

const UploadGuidelines: React.FC<UploadGuidelinesProps> = ({
  maxFileSize = 25,
  maxFiles = 15,
  acceptedFormats = ['PDF', 'JPG'],
  emailAddress,
  emailType
}) => {
  const { language } = useLanguage();
  const emailTypeLabel = emailType === 'outgoing' ? 
    (language === 'es' ? 'salida' : 'outgoing') : 
    (language === 'es' ? 'entrada' : 'incoming');

  const getTexts = () => {
    if (language === 'es') {
      return {
        maxSize: `Tamaño máximo: ${maxFileSize}MB por archivo`,
        maxFilesText: `Máximo ${maxFiles} archivos a la vez`,
        formats: `Formatos aceptados: ${acceptedFormats.join(', ')}`,
        emailConfirmed: `Las notificaciones por correo electrónico se enviarán a: ${emailAddress}`,
        emailWarning: `Advertencia: No hay correo electrónico de factura de ${emailTypeLabel} configurado en su perfil`
      };
    } else {
      return {
        maxSize: `Maximum file size: ${maxFileSize}MB per file`,
        maxFilesText: `Maximum ${maxFiles} files at once`,
        formats: `Accepted formats: ${acceptedFormats.join(', ')}`,
        emailConfirmed: `Email notifications will be sent to: ${emailAddress}`,
        emailWarning: `Warning: No ${emailTypeLabel} invoice email configured in your profile`
      };
    }
  };
  
  const texts = getTexts();

  return (
    <div className="bg-muted p-4 rounded-md text-sm space-y-1">
      <p>{texts.maxSize}</p>
      <p>{texts.maxFilesText}</p>
      <p>{texts.formats}</p>
      {emailAddress ? (
        <p className="text-green-600">{texts.emailConfirmed}</p>
      ) : (
        <p className="text-amber-600">{texts.emailWarning}</p>
      )}
    </div>
  );
};

export default UploadGuidelines;
