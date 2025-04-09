
import React, { useState } from 'react';
import { UsefulLink } from '@/pages/UsefulLinks/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddEditLinkDialog from './AddEditLinkDialog';

interface UsefulLinksTableProps {
  links: UsefulLink[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => Promise<void>;
  refetch: () => Promise<any>;
}

const UsefulLinksTable: React.FC<UsefulLinksTableProps> = ({ 
  links, 
  isLoading, 
  error, 
  onDelete,
  refetch
}) => {
  const { t } = useLanguage();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<UsefulLink | null>(null);
  
  const handleDeleteClick = (id: string) => {
    setLinkToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (linkToDelete) {
      await onDelete(linkToDelete);
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };
  
  const handleEditClick = (link: UsefulLink) => {
    setLinkToEdit(link);
    setEditDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p>{t('app.loading')}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full p-4 bg-destructive/10 text-destructive rounded-md">
        <p>{t('app.error_loading_data')}</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.useful_links.table.title')}</TableHead>
              <TableHead>{t('admin.useful_links.table.category')}</TableHead>
              <TableHead>{t('admin.useful_links.table.url')}</TableHead>
              <TableHead className="w-[150px]">{t('admin.useful_links.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {t('admin.useful_links.no_links')}
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.title}</TableCell>
                  <TableCell>{link.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {link.url}
                      <ExternalLink size={12} />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditClick(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.useful_links.delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.useful_links.delete_confirm_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('app.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('app.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {linkToEdit && (
        <AddEditLinkDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          initialData={linkToEdit}
          onSuccess={() => {
            refetch();
            setEditDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default UsefulLinksTable;
