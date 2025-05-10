import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '../hooks/useServiceData';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface ServiceTableProps {
  services: Service[];
  onDelete: (serviceId: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const { t } = useLanguage();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('services.title')}</TableHead>
          <TableHead>{t('services.description')}</TableHead>
          <TableHead>{t('services.price')}</TableHead>
          <TableHead>{t('services.category')}</TableHead>
          <TableHead>{t('services.status')}</TableHead>
          <TableHead>{t('services.created')}</TableHead>
          <TableHead>{t('services.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell className="max-w-md truncate">
              {service.description}
            </TableCell>
            <TableCell>${service.price}</TableCell>
            <TableCell>{service.category || '-'}</TableCell>
            <TableCell>
              {service.status === 'active' ? (
                <Badge className="bg-green-500">
                  {t('services.status.active')}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500">
                  {t('services.status.inactive')}
                </Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(service.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/services/edit/${service.id}`}>
                    <Edit className="h-4 w-4 mr-1" /> {t('service.edit')}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 p-2"
                  onClick={() => onDelete(service.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
