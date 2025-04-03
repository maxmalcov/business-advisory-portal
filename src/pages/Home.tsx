import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Users, Shield, FileText, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-ba-blue to-ba-blue-dark text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('app.welcome')}
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Your comprehensive accounting and business management portal. Access your documents, submit invoices, and manage your business from anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-ba-blue hover:bg-white/90">
                    {t('app.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="register" className="border-white hover:bg-white/10">
                    {t('app.register')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 p-4 rounded-xl flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <span>Invoice Management</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl flex flex-col items-center text-center">
                    <Users className="h-8 w-8 mb-2" />
                    <span>HR & Payroll</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl flex flex-col items-center text-center">
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <span>Financial Reports</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl flex flex-col items-center text-center">
                    <Shield className="h-8 w-8 mb-2" />
                    <span>Secure Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ba-gray-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="h-10 w-10 mb-4 text-ba-blue" />
              <h3 className="text-xl font-semibold mb-2">Invoice Management</h3>
              <p className="text-gray-600">Upload, manage, and track your invoices. Get notifications when your documents are processed.</p>
            </div>
            
            <div className="bg-ba-gray-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Users className="h-10 w-10 mb-4 text-ba-blue" />
              <h3 className="text-xl font-semibold mb-2">HR & Payroll</h3>
              <p className="text-gray-600">Handle employee onboarding, terminations, and manage work hours and payroll documents.</p>
            </div>
            
            <div className="bg-ba-gray-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Globe className="h-10 w-10 mb-4 text-ba-blue" />
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-gray-600">Access the portal in English, Spanish, or Russian with full translation of all features and forms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-ba-gray">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join Business Advisory today and streamline your business administration.</p>
          <Link to="/register">
            <Button size="lg" variant="register">Create Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ba-blue-dark text-white py-10 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Business Advisory</h3>
              <p className="max-w-xs text-white/70">Professional accounting and business advisory services for companies and individuals.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-lg font-semibold mb-3">Services</h4>
                <ul className="space-y-2 text-white/70">
                  <li>Accounting</li>
                  <li>Tax Advisory</li>
                  <li>Business Consulting</li>
                  <li>HR Management</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-white/70">
                  <li>FAQ</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/60">
            <p>© {new Date().getFullYear()} Business Advisory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
