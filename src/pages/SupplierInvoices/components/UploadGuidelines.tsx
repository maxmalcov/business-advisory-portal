
import React from 'react';
import {useLanguage} from "@/context/LanguageContext.tsx";

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
  const emailTypeLabel = emailType === 'outgoing' ? 'outgoing' : 'incoming';

  const {t} = useLanguage()

  return (
    <div className="bg-muted p-4 rounded-md text-sm space-y-1">
      <p>{t('invoices.guidelines.maxsize').replace('|', maxFileSize.toString())}</p>
      <p>{t('invoices.guidelines.maxfiles').replace('|', maxFiles.toString())}</p>
      <p>{t('invoices.guidelines.accepted-formats').replace('|', acceptedFormats.join(', '))}</p>
      {emailAddress ? (
        <p className="text-green-600">{t('invoices.guidelines.email-to').replace('|', emailAddress)}</p>
      ) : (
        <p className="text-amber-600">{t('invoices.guidelines.email-warning').replace('|', emailTypeLabel)}</p>
      )}
    </div>
  );
};

export default UploadGuidelines;
