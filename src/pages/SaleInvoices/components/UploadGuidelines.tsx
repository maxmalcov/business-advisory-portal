
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UploadGuidelinesProps {
  emailAddress?: string;
  emailType?: string;
}

const UploadGuidelines: React.FC<UploadGuidelinesProps> = ({ 
  emailAddress,
  emailType = 'outgoing'
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Guidelines for uploading sales invoices</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Upload your invoices in PDF, JPG or JPEG format</li>
            <li>Maximum file size: 25MB per file</li>
            <li>You can upload up to 15 files at once</li>
            <li>After upload, you can send the files to your configured email</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      {!emailAddress && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email not configured</AlertTitle>
          <AlertDescription>
            You need to set up an {emailType === 'outgoing' ? 'outgoing' : 'incoming'} invoice email address in your profile 
            settings before you can use the email feature.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadGuidelines;
