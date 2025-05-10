import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceStatus } from '../hooks/useServiceRequests';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface ServiceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ServiceStatus;
  setStatusFilter: (status: ServiceStatus) => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">{t('service.search')}</Label>
            <Input
              id="search-query"
              placeholder={t('service.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">{t('service.status')}</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ServiceStatus)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder={t('service.status.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('service.status.all-status')}
                </SelectItem>
                <SelectItem value="pending">
                  {t('service.status.pending')}
                </SelectItem>
                <SelectItem value="completed">
                  {t('service.status.completed')}
                </SelectItem>
                <SelectItem value="rejected">
                  {t('service.status.rejected')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFilters;
