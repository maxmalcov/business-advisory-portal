
import React, { useState } from 'react';
import { UsefulLink } from '@/pages/UsefulLinks/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AddEditLinkDialog from './AddEditLinkDialog';
import DeleteLinkDialog from './DeleteLinkDialog';

interface UsefulLinksTableProps {
  links: UsefulLink[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

const UsefulLinksTable: React.FC<UsefulLinksTableProps> = ({ 
  links, 
  isLoading, 
  error,
  refetch
}) => {
  const { t } = useLanguage();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<UsefulLink | undefined>(undefined);

  const handleEditClick = (link: UsefulLink) => {
    setSelectedLink(link);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (link: UsefulLink) => {
    setSelectedLink(link);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="animate-pulse h-96 w-full bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        Error loading data. Please try again later.
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No links available. Click "Add New Link" to create your first resource.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">Title</th>
              <th className="p-3 text-left font-medium">Category</th>
              <th className="p-3 text-left font-medium">Icon</th>
              <th className="p-3 text-left font-medium">Display Order</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link.id} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <div className="font-medium">{link.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">{link.url}</div>
                </td>
                <td className="p-3">{link.category}</td>
                <td className="p-3">{link.icon || '—'}</td>
                <td className="p-3">{link.display_order || 0}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(link)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(link)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLink && (
        <>
          <AddEditLinkDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            mode="edit"
            initialData={selectedLink}
            onSuccess={refetch}
          />
          
          <DeleteLinkDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            linkId={selectedLink.id}
            linkTitle={selectedLink.title}
            onSuccess={refetch}
          />
        </>
      )}
    </>
  );
};

export default UsefulLinksTable;
