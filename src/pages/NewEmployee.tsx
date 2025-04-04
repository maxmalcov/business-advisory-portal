
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, HelpCircle } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { format } from 'date-fns';

interface FormData {
  companyName: string;
  employeeDni: string;
  startDate: Date | undefined;
  schedule: string;
  position: string;
  socialSecurityNumber: string;
  salary: string;
  salaryType: 'gross' | 'net';
  iban: string;
  address: string;
  employeeEmail: string;
  comments: string;
  idDocument: File | null;
}

const NewEmployee: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
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
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file type
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type);
      if (!isValidType) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'Only PDF and JPG files are accepted' 
        }));
        return;
      }
      
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({ 
          ...prev, 
          idDocument: 'File size must be less than 25MB' 
        }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, idDocument: file }));
      
      // Clear error
      if (errors.idDocument) {
        setErrors((prev) => ({ ...prev, idDocument: undefined }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
    
    // Clear error
    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }
  };

  const handleSalaryTypeChange = (type: 'gross' | 'net') => {
    setFormData((prev) => ({ ...prev, salaryType: type }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Required fields
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.employeeDni) newErrors.employeeDni = 'Employee DNI/TIE is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.schedule) newErrors.schedule = 'Schedule is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.socialSecurityNumber) newErrors.socialSecurityNumber = 'Social Security number is required';
    if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission - normally this would be an API call
    setTimeout(() => {
      toast({
        title: 'Form Submitted',
        description: 'New employee information has been sent successfully.',
      });
      
      // Reset form
      setFormData({
        companyName: '',
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
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('hr.new_employee.title')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('hr.new_employee.title')}</CardTitle>
            <CardDescription>Fill in the form below to register a new employee</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Required Fields Section */}
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
                      ID Document (PDF or JPG) <span className="text-red-500 ml-1">*</span>
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
                    <Input
                      id="idDocument"
                      name="idDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className={errors.idDocument ? "border-red-500" : ""}
                    />
                  </div>
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
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
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

              {/* Optional Fields Section */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-1">Optional Information</h3>
                
                {/* Salary */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="salary">
                      {t('hr.new_employee.salary')}
                    </Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Salary Information</h4>
                          <p className="text-sm">
                            If not specified, we will calculate the minimum legal salary. Choose whether the amount is gross (before taxes) or net (what the employee receives).
                          </p>
                          <p className="text-sm font-medium">
                            NET salary is the amount which the worker receives in their bank account after taxes.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="Enter amount in EUR"
                      className="flex-1"
                    />
                    <div className="flex rounded-md border bg-background">
                      <Button
                        type="button"
                        variant={formData.salaryType === 'gross' ? 'default' : 'outline'}
                        className="rounded-r-none flex-1 px-3"
                        onClick={() => handleSalaryTypeChange('gross')}
                      >
                        Gross
                      </Button>
                      <Button
                        type="button"
                        variant={formData.salaryType === 'net' ? 'default' : 'outline'}
                        className="rounded-l-none flex-1 px-3"
                        onClick={() => handleSalaryTypeChange('net')}
                      >
                        Net
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optional. If left empty, minimum legal salary will be applied.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* IBAN */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="iban">
                        {t('hr.new_employee.iban')}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Bank account number for salary payments.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="iban"
                      name="iban"
                      value={formData.iban}
                      onChange={handleInputChange}
                      placeholder="ES00 0000 0000 0000 0000 0000"
                    />
                  </div>
                  
                  {/* Employee Email */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="employeeEmail">
                        {t('hr.new_employee.email')}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Employee's personal or professional email address.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="employeeEmail"
                      name="employeeEmail"
                      type="email"
                      value={formData.employeeEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="address">
                      {t('hr.new_employee.address')}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Employee's current residential address.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street, City, Postal Code, Country"
                  />
                </div>
                
                {/* Additional Comments */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="comments">
                      {t('hr.new_employee.comments')}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Any additional information or special considerations for this employee.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline">
                {t('app.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('app.loading') : t('app.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default NewEmployee;
