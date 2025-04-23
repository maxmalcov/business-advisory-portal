
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import BasicInfoSection from './BasicInfoSection';
import AccountInfoSection from './AccountInfoSection';
import InvoiceEmailsSection from './InvoiceEmailsSection';
import LocationInfoSection from './LocationInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import ActivityTabContent from './ActivityTab';
import type { User } from '../../hooks/types';

interface UserEditTabsProps {
  user: User;
  onUserChange: (user: User) => void;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserEditTabs: React.FC<UserEditTabsProps> = ({
  user,
  onUserChange,
  isEditMode,
  setIsEditMode,
  activeTab,
  setActiveTab
}) => {
  const isReadOnly = !isEditMode;
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <div className="px-6 border-b">
        <TabsList className="gap-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity & Account</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent 
        value="details" 
        className="flex-1 h-full data-[state=active]:flex data-[state=inactive]:hidden flex-col overflow-hidden"
      >
        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BasicInfoSection user={user} onUserChange={onUserChange} isReadOnly={isReadOnly} />
              <div className="grid grid-cols-1 gap-4">
                <AccountInfoSection user={user} onUserChange={onUserChange} isReadOnly={isReadOnly} />
              </div>
            </div>
            
            <LocationInfoSection user={user} onUserChange={onUserChange} isReadOnly={isReadOnly} />
            
            <InvoiceEmailsSection user={user} onUserChange={onUserChange} isReadOnly={isReadOnly} />
            
            <IframeUrlsSection 
              user={user} 
              onUserChange={onUserChange} 
              isReadOnly={isReadOnly}
            />
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent 
        value="activity" 
        className="flex-1 h-full data-[state=active]:flex data-[state=inactive]:hidden flex-col overflow-hidden"
      >
        <ActivityTabContent userId={user.id} />
      </TabsContent>
    </Tabs>
  );
};

export default UserEditTabs;
