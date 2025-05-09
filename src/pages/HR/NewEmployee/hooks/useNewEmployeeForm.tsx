import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { employeesTable } from '@/integrations/supabase/client';
import { FormData, FormErrors } from '../types';

export const useNewEmployeeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    fullName: '',
    employeeDni: '',
    startDate: undefined,
    schedule: '',
    position: '',
    socialSecurityNumber: '',
    salary: '',
    salaryType: 'gross',
    iban: '',
    address: '',
    employeeEmail: '',
    comments: '',
    idDocument: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const isValidType = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ].includes(file.type);
      if (!isValidType) {
        setErrors((prev) => ({
          ...prev,
          idDocument: 'Only PDF, JPG and PNG files are accepted',
        }));
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          idDocument: 'File size must be less than 25MB',
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, idDocument: file }));

      if (errors.idDocument) {
        setErrors((prev) => ({ ...prev, idDocument: undefined }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, startDate: date }));

    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleSalaryTypeChange = (type: 'gross' | 'net') => {
    setFormData((prev) => ({ ...prev, salaryType: type }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName)
      newErrors.companyName = 'Company name is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.employeeDni)
      newErrors.employeeDni = 'Employee DNI/TIE is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.schedule) newErrors.schedule = 'Schedule is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.socialSecurityNumber)
      newErrors.socialSecurityNumber = 'Social Security number is required';
    if (!formData.idDocument) newErrors.idDocument = 'ID document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    navigate('/hr');
  };

  return {
    formData,
    errors,
    isSubmitting,
    uploadProgress,
    setIsSubmitting,
    setUploadProgress,
    handleInputChange,
    handleFileChange,
    handleDateChange,
    handleSalaryTypeChange,
    validate,
    handleCancel,
    toast,
    navigate,
  };
};
