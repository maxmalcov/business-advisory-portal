
import React from 'react';
import { FileText } from 'lucide-react';
import DocumentActions from './DocumentActions';
import { getDocumentFilename } from '../utils/documentUtils';

interface DocumentDisplayProps {
  documentPath: string;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ documentPath }) => {
  const filename = getDocumentFilename(documentPath);
  
  return (
    <div className="flex items-center">
      <FileText className="h-4 w-4 mr-2 text-blue-500" />
      <span className="text-sm truncate max-w-[150px]">
        {filename}
      </span>
      <DocumentActions documentPath={documentPath} filename={filename} />
    </div>
  );
};

export default DocumentDisplay;
