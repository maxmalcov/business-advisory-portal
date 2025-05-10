import React from 'react';
import { formatTooltipDate } from '../utils/chartUtils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  data: Array<{ date: string; displayDate: string; count: number }>;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  data,
}) => {
  if (active && payload && payload.length) {
    const registrationItem = data.find(
      (item) => item.count === payload[0].value,
    );

    return (
      <div className="bg-white border border-gray-200 shadow-md p-2 rounded-md">
        <p className="font-semibold text-sm">{`Registrations: ${payload[0].value}`}</p>
        {registrationItem && registrationItem.date && (
          <p className="text-xs text-gray-500 mt-1">
            {formatTooltipDate(registrationItem.date)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
