
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Building, 
  FileText, 
  MapPin, 
  Phone 
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.profile')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-primary text-white text-xl">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription className="text-lg">
                  {user?.userType === 'admin' ? 
                    'Administrator' : 
                    `${user?.accountType ? `${user.accountType.toUpperCase()} Client` : 'Client'}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </div>
                
                {user?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{user.phone}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Company Information */}
              {user?.companyName && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Building className="h-5 w-5 mr-2" /> 
                      Company Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Company Name</div>
                        <div className="font-medium">{user.companyName}</div>
                      </div>
                      
                      {user.nif && (
                        <div>
                          <div className="text-sm text-muted-foreground">NIF</div>
                          <div className="font-medium">{user.nif}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* Contact Information */}
              {user?.address && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2" /> 
                      Address
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <div className="text-sm text-muted-foreground">Street</div>
                        <div className="font-medium">{user.address}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">City</div>
                        <div className="font-medium">{user.city}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Postal Code</div>
                        <div className="font-medium">{user.postalCode}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Province</div>
                        <div className="font-medium">{user.province}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Country</div>
                        <div className="font-medium">{user.country}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Invoice Email Settings */}
              {(user?.incomingInvoiceEmail || user?.outgoingInvoiceEmail) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" /> 
                      Invoice Email Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.incomingInvoiceEmail && (
                        <div>
                          <div className="text-sm text-muted-foreground">Incoming Invoice Email</div>
                          <div className="font-medium">{user.incomingInvoiceEmail}</div>
                        </div>
                      )}
                      
                      {user.outgoingInvoiceEmail && (
                        <div>
                          <div className="text-sm text-muted-foreground">Outgoing Invoice Email</div>
                          <div className="font-medium">{user.outgoingInvoiceEmail}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* User Type Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="font-medium">User Type</div>
                <div className="bg-muted rounded-md px-3 py-2 flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="capitalize">{user?.userType}</span>
                </div>
              </div>
              
              {user?.accountType && (
                <div className="grid gap-2">
                  <div className="font-medium">Account Type</div>
                  <div className="bg-muted rounded-md px-3 py-2 flex items-center space-x-2">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="uppercase">{user?.accountType}</span>
                  </div>
                </div>
              )}
              
              {user?.iframeUrls && user.iframeUrls.length > 0 && (
                <div className="grid gap-2">
                  <div className="font-medium">Iframe URLs</div>
                  <div className="space-y-2">
                    {user.iframeUrls.map((url, index) => (
                      <div key={index} className="text-sm truncate bg-muted rounded-md px-3 py-2">
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
