import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import BasicInfoSection from './BasicInfoSection';
import AccountInfoSection from './AccountInfoSection';
import InvoiceEmailsSection from './InvoiceEmailsSection';
import LocationInfoSection from './LocationInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import ActivityTabContent from './ActivityTabContent';
import { useLanguage } from '@/context/LanguageContext';
import type { User } from '../../hooks/types';

interface UserEditTabsProps {
  user: User;
  onUserChange: (user: User) => void;
  isEditMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserEditTabs: React.FC<UserEditTabsProps> = ({
  user,
  onUserChange,
  isEditMode,
  activeTab,
  setActiveTab
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 overflow-hidden border-y">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="h-full">
          <TabsList className="w-full justify-start px-6 pt-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <div className="px-6 py-4">
            <TabsContent value="details" className="space-y-6 mt-0">
              <BasicInfoSection
                user={user}
                onUserChange={onUserChange}
                isReadOnly={!isEditMode}
              />
              
              <AccountInfoSection
                user={user}
                onUserChange={onUserChange}
                isReadOnly={!isEditMode}
              />
              
              <InvoiceEmailsSection
                user={user}
                onUserChange={onUserChange}
                isReadOnly={!isEditMode}
              />
              
              <LocationInfoSection
                user={user}
                onUserChange={onUserChange}
                isReadOnly={!isEditMode}
              />
              
              {/* IframeUrlsSection is always editable regardless of isEditMode */}
              <IframeUrlsSection
                user={user}
                onUserChange={onUserChange}
                isReadOnly={false}
              />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              <ActivityTabContent userId={user.id} />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default UserEditTabs;
