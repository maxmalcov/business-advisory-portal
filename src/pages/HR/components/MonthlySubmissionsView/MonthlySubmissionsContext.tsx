
import React, { createContext, useContext, useState } from 'react';
import { WorkHoursData } from '../../hooks/useEmployeeWorkHours';

interface MonthlySubmissionsContextType {
  editingEmployee: WorkHoursData | null;
  setEditingEmployee: (employee: WorkHoursData | null) => void;
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
  handleEditEmployee: (employee: WorkHoursData) => void;
  handleCancelEdit: () => void;
  handleAddEmployee: () => void;
}

const MonthlySubmissionsContext = createContext<MonthlySubmissionsContextType | undefined>(undefined);

export const useMonthlySubmissions = () => {
  const context = useContext(MonthlySubmissionsContext);
  if (!context) {
    throw new Error('useMonthlySubmissions must be used within a MonthlySubmissionsProvider');
  }
  return context;
};

interface MonthlySubmissionsProviderProps {
  children: React.ReactNode;
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
}

export const MonthlySubmissionsProvider: React.FC<MonthlySubmissionsProviderProps> = ({
  children,
  isAddingNew,
  setIsAddingNew,
}) => {
  const [editingEmployee, setEditingEmployee] = useState<WorkHoursData | null>(null);

  const handleEditEmployee = (employee: WorkHoursData) => {
    setEditingEmployee(employee);
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setIsAddingNew(false);
  };

  const handleAddEmployee = () => {
    const today = new Date();
    const selectedMonth = new Date(); // This would come from props in a real implementation
    
    setEditingEmployee({
      employeeName: '',
      grossSalary: 0,
    });
    setIsAddingNew(true);
  };

  const value = {
    editingEmployee,
    setEditingEmployee,
    isAddingNew,
    setIsAddingNew,
    handleEditEmployee,
    handleCancelEdit,
    handleAddEmployee,
  };

  return (
    <MonthlySubmissionsContext.Provider value={value}>
      {children}
    </MonthlySubmissionsContext.Provider>
  );
};
