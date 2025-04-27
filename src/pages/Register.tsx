import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AccountType, useAuth} from '@/context/AuthContext';
import {useLanguage} from '@/context/LanguageContext';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {useToast} from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';
import {log} from "@/utils/logs/log.funciton.ts";
import {LogCategory} from "@/pages/AdminLogs/types.ts";

const Register: React.FC = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'freelancer' as AccountType,
    companyName: '',
    adminName: '',
    nif: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    country: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register({
        ...formData,
        userType: 'client',
      });
      log({ action: 'logs.register_action', description: `logs.register_description|${formData.email}`, category: LogCategory.USER, user: formData.email, level: 'info'})
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      // Toast is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we're dealing with a business account type
  const isBusinessAccount = ['sl', 'sa', 'freelancer'].includes(formData.accountType);

  return (
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{t('registration.title')}</CardTitle>
          <CardDescription>Create a new Business Advisory account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Language and Account Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('registration.language')}</Label>
                <LanguageSelector />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">{t('registration.type')}</Label>
                <Select 
                  value={formData.accountType} 
                  onValueChange={(value) => handleSelectChange('accountType', value)}
                >
                  <SelectTrigger id="accountType">
                    <SelectValue placeholder={t('registration.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelancer">{t('registration.type.freelancer')}</SelectItem>
                    <SelectItem value="sl">{t('registration.type.sl')}</SelectItem>
                    <SelectItem value="sa">{t('registration.type.sa')}</SelectItem>
                    <SelectItem value="individual">{t('registration.type.individual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Individual or Business Information */}
            {isBusinessAccount ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">{t('registration.admin_name')} <span className="text-sm text-muted-foreground">(Optional)</span></Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('registration.company')} *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">{t('registration.name')} *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="nif">{t('registration.nif')} *</Label>
              <Input
                id="nif"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">{t('registration.address')} *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* City, Postal Code, Province and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal">{t('registration.postal')} *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('registration.city')} *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">{t('registration.province')} *</Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('registration.country')} *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('registration.email')} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('registration.phone')} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')} *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm {t('auth.password')} *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('app.loading') : t('app.register')}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('app.login')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
