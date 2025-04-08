
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, HelpCircle, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { FormData, FormErrors } from '../types';
import { Progress } from '@/components/ui/progress';

interface RequiredFieldsProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  uploadProgress = 0
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold border-b pb-1">Required Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center">
            {t('hr.new_employee.company')} <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>
        
        {/* Full Name - New Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center">
            Full Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="e.g., John Doe"
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        
        {/* Employee DNI/TIE */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="employeeDni" className="flex items-center">
              {t('hr.new_employee.dni')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>DNI for Spanish nationals or TIE/NIE for foreign residents.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="employeeDni"
            name="employeeDni"
            value={formData.employeeDni}
            onChange={handleInputChange}
            className={errors.employeeDni ? "border-red-500" : ""}
          />
          {errors.employeeDni && (
            <p className="text-sm text-red-500">{errors.employeeDni}</p>
          )}
        </div>
      </div>
      
      {/* ID Document Upload */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="idDocument" className="flex items-center">
            ID Document (PDF, JPG or PNG) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Upload a scanned copy of the employee's identification document.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center">
          <div className="relative w-full">
            <Input
              id="idDocument"
              name="idDocument"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className={`${errors.idDocument ? "border-red-500" : ""} cursor-pointer`}
            />
            <label htmlFor="idDocument" className="absolute inset-0 flex items-center justify-center opacity-0">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">Uploading: {Math.round(uploadProgress)}%</p>
          </div>
        )}
        {errors.idDocument && (
          <p className="text-sm text-red-500">{errors.idDocument}</p>
        )}
        {formData.idDocument && (
          <p className="text-sm text-muted-foreground">
            File: {formData.idDocument.name} 
            ({(formData.idDocument.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </div>
      
      {/* Start Date */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="startDate" className="flex items-center">
            {t('hr.new_employee.start_date')} <span className="text-red-500 ml-1">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>The first day the employee will start working.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !formData.startDate ? "text-muted-foreground" : ""
              } ${errors.startDate ? "border-red-500" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.startDate ? format(formData.startDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate}</p>
        )}
      </div>
      
      {/* Weekly Schedule */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="schedule" className="flex items-center">
            {t('hr.new_employee.schedule')} <span className="text-red-500 ml-1">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Specify working days and hours, including breaks if applicable.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="schedule"
          name="schedule"
          value={formData.schedule}
          onChange={handleInputChange}
          placeholder="e.g., Monday-Friday, 9:00-17:00"
          className={errors.schedule ? "border-red-500" : ""}
        />
        {errors.schedule && (
          <p className="text-sm text-red-500">{errors.schedule}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {t('hr.new_employee.days_off')}
        </p>
      </div>
      
      {/* Position */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="position" className="flex items-center">
            {t('hr.new_employee.position')} <span className="text-red-500 ml-1">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>The employee's job title or role within the company.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          className={errors.position ? "border-red-500" : ""}
        />
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position}</p>
        )}
      </div>
      
      {/* Social Security Number */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="socialSecurityNumber" className="flex items-center">
            {t('hr.new_employee.ss_number')} <span className="text-red-500 ml-1">*</span>
          </Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Social Security Number Information</h4>
                <div className="text-sm">
                  <p className="mb-2">If you have an electronic certificate installed on your computer, you can request a social security number at:</p>
                  <a 
                    href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Altas%2C+bajas+y+modificaciones/Altas+y+afiliacion+de+trabajadores/Solicitar+el+numero+de+la+Seguridad+Social"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mb-2 break-words"
                  >
                    Request Social Security Number
                  </a>
                  <p className="mb-2">Or, if you already have it, you can check it here:</p>
                  <a
                    href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Vida+laboral+e+informes/Informes+sobre+tu+situacion+laboral/Acreditacion_NUSS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block break-words"
                  >
                    Check Existing Social Security Number
                  </a>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Input
          id="socialSecurityNumber"
          name="socialSecurityNumber"
          value={formData.socialSecurityNumber}
          onChange={handleInputChange}
          className={errors.socialSecurityNumber ? "border-red-500" : ""}
        />
        {errors.socialSecurityNumber && (
          <p className="text-sm text-red-500">{errors.socialSecurityNumber}</p>
        )}
        <p className="text-sm">
          <a 
            href="https://www.seg-social.es/wps/portal/wss/internet/Trabajadores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Visit Social Security website
          </a>
        </p>
      </div>
    </div>
  );
};

export default RequiredFields;
