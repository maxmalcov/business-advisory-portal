
import React from 'react';
import { Input } from '@/components/ui/input';
import DocumentViewer from './DocumentViewer';

interface IDDocumentDisplayProps {
  documentPath: string | undefined;
}

const IDDocumentDisplay: React.FC<IDDocumentDisplayProps> = ({ documentPath }) => {
  // Extract just the filename from the path, if available
  const displayName = documentPath 
    ? documentPath.split('/').pop() || documentPath 
    : '';

  return (
    <div className="flex">
      <Input
        value={displayName}
        disabled
        className="flex-1"
      />
      <DocumentViewer documentPath={documentPath} />
    </div>
  );
};

export default IDDocumentDisplay;
