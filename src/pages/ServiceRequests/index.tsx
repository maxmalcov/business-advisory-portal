import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useServiceRequests } from './hooks/useServiceRequests';

const ServiceRequests: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { serviceRequests, isLoading, filteredRequests, filterRequests } =
    useServiceRequests();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterRequests(searchQuery);
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          variant: 'outline' as const,
          children: (
            <>
              <Clock className="mr-1 h-3 w-3" /> Pending
            </>
          ),
        };
      case 'in progress':
        return {
          variant: 'secondary' as const,
          children: (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> In Progress
            </>
          ),
        };
      case 'completed':
        return {
          variant: 'default' as const,
          children: (
            <>
              <CheckCircle className="mr-1 h-3 w-3" /> Completed
            </>
          ),
        };
      default:
        return { variant: 'outline' as const, children: status };
    }
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
            Service Requests
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
        <Input
          type="text"
          placeholder="Search service requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {/* Service Requests List */}
      {isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No service requests found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.serviceName}
                    </TableCell>
                    <TableCell>
                      <Badge {...getStatusBadgeProps(request.status)} />
                    </TableCell>
                    <TableCell>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.completionDate
                        ? new Date(request.completionDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceRequests;
