import React, { useState } from 'react';
import { IframeSubscription } from '../../hooks/types';
import SubscriptionHeader from './SubscriptionComponents/SubscriptionHeader';
import SubscriptionDetails from './SubscriptionComponents/SubscriptionDetails';
import SubscriptionPeriodEditor from './SubscriptionComponents/SubscriptionPeriodEditor';

interface SubscriptionItemProps {
  subscription: IframeSubscription;
  onToggleStatus: (id: string) => void;
  onUpdatePeriod: (
    id: string,
    startDate: Date,
    endDate?: Date,
    isLifetime?: boolean,
  ) => void;
  formatDate: (date?: Date) => string;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  onToggleStatus,
  onUpdatePeriod,
  formatDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    subscription.startDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    subscription.endDate,
  );
  const [isLifetime, setIsLifetime] = useState(subscription.isLifetime);

  const handleSavePeriod = () => {
    if (startDate) {
      onUpdatePeriod(
        subscription.id,
        startDate,
        isLifetime ? undefined : endDate,
        isLifetime,
      );
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setStartDate(subscription.startDate);
    setEndDate(subscription.endDate);
    setIsLifetime(subscription.isLifetime);
    setIsEditing(false);
  };

  return (
    <div className="mb-4 border rounded-md overflow-hidden">
      <SubscriptionHeader
        subscription={subscription}
        onToggleStatus={onToggleStatus}
        onEditClick={() => setIsEditing(true)}
      />

      {isEditing ? (
        <SubscriptionPeriodEditor
          startDate={startDate}
          endDate={endDate}
          isLifetime={isLifetime}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onLifetimeChange={setIsLifetime}
          onSave={handleSavePeriod}
          onCancel={handleCancelEdit}
        />
      ) : (
        <SubscriptionDetails
          subscription={subscription}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default SubscriptionItem;
