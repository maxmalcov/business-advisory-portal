
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServiceData } from '@/pages/AdminServices/hooks/useServiceData';

const ServicesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { services, loading, handleEditService, handleDeleteServiceClick } = useServiceData();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Available Services</CardTitle>
        <Button 
          onClick={() => navigate('/admin/services/create')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Service
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No services available</p>
            <Button 
              onClick={() => navigate('/admin/services/create')}
              className="flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Create First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className={`h-2 w-full ${service.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive" 
                        onClick={() => handleDeleteServiceClick(service.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesManagement;
