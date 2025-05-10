import { ServiceItem } from './types';

export const initialServices: ServiceItem[] = [
  {
    id: 'service1',
    title: 'Payroll Management',
    description:
      'Complete payroll processing and management services for your business.',
    iconName: 'CircleDollarSign',
    price: '', // Removed price information
    badges: [
      'Monthly payroll processing',
      'Tax calculations & filings',
      'Direct deposit setup',
      'Year-end reporting',
    ],
    popular: true,
    status: 'available',
  },
  {
    id: 'service2',
    title: 'Tax Advisory',
    description:
      'Professional tax planning and advisory services to minimize your tax burden.',
    iconName: 'FileText',
    price: '', // Removed price information
    badges: [
      'Tax return preparation',
      'Tax planning strategies',
      'Audit support',
      'VAT compliance',
    ],
    status: 'available',
  },
  {
    id: 'service3',
    title: 'HR Management',
    description:
      'Comprehensive human resources services for employee management.',
    iconName: 'Users',
    price: '', // Removed price information
    badges: [
      'Employee onboarding',
      'Benefits administration',
      'HR policy development',
      'Performance management',
    ],
    status: 'pending',
  },
  {
    id: 'service4',
    title: 'Bookkeeping Plus',
    description:
      'Enhanced bookkeeping services with detailed financial reporting.',
    iconName: 'Package',
    price: '', // Removed price information
    badges: [
      'Daily transaction recording',
      'Monthly financial reports',
      'Accounts reconciliation',
      'Cash flow management',
    ],
    status: 'available',
  },
  {
    id: 'service5',
    title: 'Financial Analysis',
    description:
      'In-depth analysis of your financial data to support business decisions.',
    iconName: 'PackagePlus',
    price: '', // Removed price information
    badges: [
      'Profitability analysis',
      'Investment evaluation',
      'Budget preparation',
      'Financial forecasting',
    ],
    status: 'completed',
  },
  {
    id: 'service6',
    title: 'Accounting Software Setup',
    description:
      'Setup and training for accounting software tailored to your business needs.',
    iconName: 'Boxes',
    price: '', // Removed price information
    badges: [
      'Software selection guidance',
      'System configuration',
      'Data migration',
      'Staff training',
    ],
    status: 'rejected',
  },
];
