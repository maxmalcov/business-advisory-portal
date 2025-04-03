
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Subscriptions: React.FC = () => {
  const { t } = useLanguage();
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$19',
      period: '/month',
      description: 'For small businesses just getting started',
      features: [
        { name: 'Up to 25 invoices per month', included: true },
        { name: 'Basic financial reports', included: true },
        { name: 'Email support', included: true },
        { name: 'Document storage (5GB)', included: true },
        { name: 'Advanced tax advisory', included: false },
        { name: 'Priority support', included: false },
      ],
      isPopular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'Ideal for growing businesses with regular accounting needs',
      features: [
        { name: 'Unlimited invoices', included: true },
        { name: 'Advanced financial reports', included: true },
        { name: 'Email and phone support', included: true },
        { name: 'Document storage (20GB)', included: true }, 
        { name: 'Advanced tax advisory', included: true },
        { name: 'Priority support', included: false },
      ],
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For businesses with complex accounting requirements',
      features: [
        { name: 'Unlimited invoices', included: true },
        { name: 'Custom financial reports', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Document storage (Unlimited)', included: true },
        { name: 'Advanced tax advisory', included: true },
        { name: 'Priority support', included: true },
      ],
      isPopular: false,
    }
  ];

  const currentSubscription = {
    plan: 'Basic',
    status: 'Active',
    renewalDate: '2025-05-03',
    invoices: [
      { id: 'INV-2025-0012', date: '2025-04-01', amount: '$19.00', status: 'Paid' },
      { id: 'INV-2025-0008', date: '2025-03-01', amount: '$19.00', status: 'Paid' },
      { id: 'INV-2025-0003', date: '2025-02-01', amount: '$19.00', status: 'Paid' },
    ]
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.subscriptions')}</h1>
      
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Your current plan and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="font-medium">{currentSubscription.plan}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {currentSubscription.status}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Next Renewal</p>
              <p className="font-medium">{currentSubscription.renewalDate}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">Billing History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSubscription.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="mr-2">Cancel Subscription</Button>
          <Button variant="outline">Download Invoices</Button>
        </CardFooter>
      </Card>
      
      {/* Available Plans */}
      <h2 className="text-xl font-medium mt-8 mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.isPopular ? 'border-ba-blue shadow-md' : ''}`}>
            {plan.isPopular && (
              <div className="bg-ba-blue text-white py-1 px-3 text-center text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.isPopular ? "default" : "outline"}
              >
                {currentSubscription.plan === plan.name ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
