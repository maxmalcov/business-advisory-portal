import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import ActivityLogTable from './components/ActivityLogTable';
import ActivityLogPagination from './components/ActivityLogPagination';
import { useActivityLogs } from './hooks/useActivityLogs';

const UserActivityLog: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { activities, loading, totalActivities, filterActivities } =
    useActivityLogs({ itemsPerPage, currentPage, searchQuery });

  const totalPages = Math.ceil(totalActivities / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterActivities(searchQuery);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('activity.all_activity')}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
        <Input
          type="text"
          placeholder={t('activity.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          {t('activity.search')}
        </Button>
      </form>

      {/* Activity Log Table */}
      <ActivityLogTable activities={activities} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <ActivityLogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UserActivityLog;
