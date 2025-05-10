import { differenceInDays } from 'date-fns';

export const calculateDaysWorked = (startDate: Date, endDate: Date): number => {
  if (!startDate || !endDate) return 0;

  const days = differenceInDays(endDate, startDate);
  return days > 0 ? days : 0;
};

export const submitTerminationRequest = async (formData: {
  employeeId: string;
  terminationDate: Date | null;
  reason: string;
  additionalNotes: string;
}): Promise<{ data: { startDate: string; endDate: string } } | undefined> => {
  try {
    // In a real application, this would send data to a backend
    console.log('Submitting termination request:', formData);

    // Mock response with the employee start date and termination date
    // In a real app, this would come from the server
    return {
      data: {
        startDate: '2023-01-15', // This would be the actual employee start date
        endDate: formData.terminationDate
          ? formData.terminationDate.toISOString().split('T')[0]
          : '',
      },
    };
  } catch (error) {
    console.error('Error in submitTerminationRequest:', error);
    return undefined;
  }
};
