
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Tabs, 
  TabsContent 
} from "@/components/ui/tabs";
import LogsTable from './LogsTable';
import LogsFilters from './LogsFilters';
import { LogEntry, ChartDataItem, WeeklyDataItem } from '../types';

interface LogsContentProps {
  logs: LogEntry[];
  chartData: ChartDataItem[];
  weeklyData: WeeklyDataItem[];
}

const LogsContent: React.FC<LogsContentProps> = ({ 
  logs,
  chartData,
  weeklyData 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <Tabs defaultValue="logs">
      <TabsContent value="logs" className="space-y-4">
        <LogsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
        />
        
        <LogsTable logs={filteredLogs} />
      </TabsContent>
    </Tabs>
  );
};

export default LogsContent;
