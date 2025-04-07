
import React from 'react';

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

  return (
    <div className="bg-muted p-4 rounded-md text-sm space-y-1">
      <p>Maximum file size: {maxFileSize}MB per file</p>
      <p>Maximum {maxFiles} files at once</p>
      <p>Accepted formats: {acceptedFormats.join(', ')}</p>
      {emailAddress ? (
        <p className="text-green-600">Email notifications will be sent to: {emailAddress}</p>
      ) : (
        <p className="text-amber-600">Warning: No {emailTypeLabel} invoice email configured in your profile</p>
      )}
    </div>
  );
};

export default UploadGuidelines;
