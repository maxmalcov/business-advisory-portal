
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import {useLanguage} from "@/context/LanguageContext.tsx";
import {supabase} from "@/integrations/supabase/client.ts";

interface DocumentDisplayProps {
  documentUrl: string;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ documentUrl }) => {
  const fileName = documentUrl.split('/').pop() || 'Document';
  
  // Function to handle document preview
  const handlePreview = async () => {
    const { data, error } = await supabase.storage
        .from('employee_documents')
        .createSignedUrl(documentUrl, 60);

    window.open(data.signedUrl, '_blank');
  };
  
  // Function to handle document download
  const handleDownload = async () => {
    const { data, error } = await supabase.storage
        .from('employee_documents')
        .download(documentUrl);

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    console.log(url)
    a.href = url;
    a.download = documentUrl || 'download';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const {t} = useLanguage()
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center text-sm text-foreground">
        <span className="truncate max-w-[200px]">{fileName}</span>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
          onClick={handlePreview}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          {t('hr.index.employee.detail-from.id.view')}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          {t('hr.index.employee.detail-from.id.download')}
        </Button>
      </div>
    </div>
  );
};

export { DocumentDisplay };
