
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    console.log("Auth state in Login:", isAuthenticated, authLoading);
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter both email and password',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      // The redirect will happen in the useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login error:', error);
      // Toast is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helper - for development purposes
  const loginAsDemo = async (type: 'admin' | 'client') => {
    setIsLoading(true);
    try {
      const credentials = type === 'admin' 
        ? { email: 'admin@businessadvisory.com', password: 'admin123' }
        : { email: 'client@example.com', password: 'client123' };
        
      await login(credentials.email, credentials.password);
      // The redirect will happen in the useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('app.login')}</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  {t('auth.forgot_password')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading || authLoading ? t('app.loading') : t('app.login')}
            </Button>
            
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('app.register')}
              </Link>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-center text-sm text-muted-foreground mb-2">Demo Accounts</p>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  disabled={isLoading || authLoading}
                  onClick={() => loginAsDemo('admin')}
                >
                  Admin Demo
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  disabled={isLoading || authLoading}
                  onClick={() => loginAsDemo('client')}
                >
                  Client Demo
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
