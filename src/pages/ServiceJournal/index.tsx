
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { ClipboardList } from 'lucide-react';
import { ServiceJournalTable } from './components/ServiceJournalTable';
import { useServiceJournal } from './hooks/useServiceJournal';

const ServiceJournal = () => {
  const { user } = useAuth();
  const { requests, isLoading, handleRequestService } = useServiceJournal(user?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ClipboardList className="w-6 h-6 text-primary" />}
        title="Service Request History"
        subtitle="Track all your service requests and their current status"
      />
      <ServiceJournalTable
        requests={requests}
        isLoading={isLoading}
        onRequestService={handleRequestService}
      />
    </div>
  );
};

export default ServiceJournal;
