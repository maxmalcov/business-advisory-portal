
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, Package, FileText, BarChart, RefreshCw, User, CheckCircle, Clock as ClockIcon, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useUserActivity } from '../../hooks/useUserActivity';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format date and time
const formatDateTime = (date: Date): string => {
  return format(date, 'PPP p'); // e.g., "April 10, 2024, 6:30 PM"
};

// Helper function to format date only
const formatDate = (date: Date): string => {
  return format(date, 'PPP'); // e.g., "April 10, 2024"
};

// Loading skeleton for the activity tab
const ActivitySkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

interface ActivityTabContentProps {
  userId: string;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { activityData, isLoading, error } = useUserActivity(userId);
  
  useEffect(() => {
    console.log("Activity Tab Content for user:", userId);
    console.log("Activity data loaded:", activityData !== null);
    if (activityData) {
      console.log("Invoices count:", activityData.invoices.totalCount);
    }
  }, [userId, activityData]);
  
  if (isLoading) {
    return (
      <ScrollArea className="flex-1 px-6 pb-4 pt-4">
        <ActivitySkeleton />
      </ScrollArea>
    );
  }
  
  if (error || !activityData) {
    return (
      <ScrollArea className="flex-1 px-6 pb-4 pt-4">
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p>{error || "Failed to load activity data"}</p>
            <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
          </CardContent>
        </Card>
      </ScrollArea>
    );
  }
  
  return (
    <ScrollArea className="flex-1 px-6 pb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Registration Date:</span>
                    <span className="ml-2 font-medium">{formatDate(activityData.registrationInfo.registrationDate)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Registration Time:</span>
                    <span className="ml-2 font-medium">{format(activityData.registrationInfo.registrationDate, 'p')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Services Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Services:</span>
                    <span className="font-medium">{activityData.services.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed:</span>
                    <span className="font-medium">{activityData.services.filter(s => s.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">In Progress:</span>
                    <span className="font-medium">{activityData.services.filter(s => s.status === 'in-progress').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cancelled:</span>
                    <span className="font-medium">{activityData.services.filter(s => s.status === 'cancelled').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Subscription */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activityData.subscriptions.active ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plan:</span>
                      <span className="font-medium">{activityData.subscriptions.active.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Period:</span>
                      <span className="font-medium text-sm">
                        {formatDate(activityData.subscriptions.active.startDate)} - {formatDate(activityData.subscriptions.active.endDate)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <span className="text-muted-foreground">No active subscription</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Invoices Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Invoices:</span>
                    <span className="font-medium">{activityData.invoices.totalCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sale Invoices:</span>
                    <span className="font-medium">{activityData.invoices.saleInvoices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Supplier Invoices:</span>
                    <span className="font-medium">{activityData.invoices.supplierInvoices}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Services Ordered
              </CardTitle>
              <CardDescription>Full list of services requested by the user</CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.services.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {activityData.services.map(service => (
                    <div key={service.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <div className="space-y-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            Requested on {formatDate(service.requestDate)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {service.adminAssigned && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Admin: </span>
                              <span>{service.adminAssigned}</span>
                            </div>
                          )}
                          <Badge 
                            variant="outline" 
                            className={
                              service.status === 'completed' 
                                ? "bg-green-50 text-green-600 hover:bg-green-100" 
                                : service.status === 'in-progress' 
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                            }
                          >
                            {service.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {service.status === 'in-progress' && <ClockIcon className="h-3 w-3 mr-1" />}
                            {service.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                            {service.status === 'completed' 
                              ? 'Completed' 
                              : service.status === 'in-progress' 
                                ? 'In Progress' 
                                : 'Cancelled'
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-muted-foreground">No services requested</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityData.subscriptions.active ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Plan</div>
                      <div className="font-medium">{activityData.subscriptions.active.name}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Period</div>
                      <div className="font-medium text-sm">
                        {formatDate(activityData.subscriptions.active.startDate)} - {formatDate(activityData.subscriptions.active.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-muted-foreground">No active subscription</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Subscription History
              </CardTitle>
              <CardDescription>Complete history of subscription activity</CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.subscriptions.history.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium bg-muted text-sm">
                    <div className="col-span-3">Date</div>
                    <div className="col-span-4">Plan</div>
                    <div className="col-span-5">Action</div>
                  </div>
                  <div className="divide-y">
                    {activityData.subscriptions.history.map(item => (
                      <div key={`${item.id}-${item.action}`} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm">
                        <div className="col-span-3">{formatDate(item.date)}</div>
                        <div className="col-span-4">{item.name}</div>
                        <div className="col-span-5">
                          <Badge 
                            variant="outline" 
                            className={
                              item.action === 'activated' 
                                ? "bg-green-50 text-green-600 hover:bg-green-100" 
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }
                          >
                            {item.action === 'activated' ? 'Activated' : 'Cancelled'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-muted-foreground">No subscription history</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Invoices Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Total Invoices</div>
                  <div className="font-medium text-2xl">{activityData.invoices.totalCount}</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Sale Invoices</div>
                  <div className="font-medium text-2xl">{activityData.invoices.saleInvoices}</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Supplier Invoices</div>
                  <div className="font-medium text-2xl">{activityData.invoices.supplierInvoices}</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Recent Invoices</h4>
                  {/* This could be expanded with actual date range selection */}
                  <Badge variant="outline">Last 30 days</Badge>
                </div>
                
                {activityData.invoices.recentInvoices.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium bg-muted text-sm">
                      <div className="col-span-2">Type</div>
                      <div className="col-span-7">Filename</div>
                      <div className="col-span-3">Date</div>
                    </div>
                    <div className="divide-y">
                      {activityData.invoices.recentInvoices.map(invoice => (
                        <div key={invoice.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm">
                          <div className="col-span-2">
                            <Badge 
                              variant="outline" 
                              className={
                                invoice.type === 'sale' 
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }
                            >
                              {invoice.type === 'sale' ? 'Sale' : 'Supplier'}
                            </Badge>
                          </div>
                          <div className="col-span-7 truncate" title={invoice.fileName}>
                            {invoice.fileName}
                          </div>
                          <div className="col-span-3">{formatDate(invoice.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-muted-foreground">No recent invoices</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default ActivityTabContent;
