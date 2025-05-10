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
  emailType,
}) => {
  const { t } = useLanguage();

  const emailTypeLabel =
    emailType === 'outgoing'
      ? t('invoices.type.sale')
      : t('invoices.type.supplier');

  const getTexts = () => {
    return {
      maxSize: t('invoices.guidelines.maxsize').replace(
        '|',
        maxFileSize.toString(),
      ),
      maxFilesText: t('invoices.guidelines.maxfiles').replace(
        '|',
        maxFiles.toString(),
      ),
      formats: t('invoices.guidelines.accepted-formats').replace(
        '|',
        acceptedFormats.join(', '),
      ),
      emailConfirmed: t('invoices.guidelines.email-to').replace(
        '|',
        emailAddress,
      ),
      emailWarning: t('invoices.guidelines.email-warning').replace(
        '|',
        emailTypeLabel,
      ),
    };
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
