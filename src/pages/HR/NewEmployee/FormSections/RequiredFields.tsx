import React from 'react';
import { FormData, FormErrors } from '../types';
import {
  CompanyField,
  NameField,
  DniField,
  IdDocumentField,
  StartDateField,
  ScheduleField,
  PositionField,
  SocialSecurityField,
} from './RequiredFieldComponents';
interface RequiredFieldsProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress?: number;
}
const RequiredFields: React.FC<RequiredFieldsProps> = ({
  formData,
  errors,
  handleInputChange,
  handleDateChange,
  handleFileChange,
  uploadProgress = 0,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold border-b pb-1 py-[20px]">
        Required Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <CompanyField
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />

        {/* Full Name */}
        <NameField
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />

        {/* Employee DNI/TIE */}
        <DniField
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      </div>

      {/* ID Document Upload */}
      <IdDocumentField
        formData={formData}
        errors={errors}
        handleFileChange={handleFileChange}
        uploadProgress={uploadProgress}
      />

      {/* Start Date */}
      <StartDateField
        formData={formData}
        errors={errors}
        handleDateChange={handleDateChange}
      />

      {/* Weekly Schedule */}
      <ScheduleField
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      {/* Position */}
      <PositionField
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      {/* Social Security Number */}
      <SocialSecurityField
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
export default RequiredFields;
