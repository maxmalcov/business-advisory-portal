
import { 
  CircleDollarSign, 
  FileText, 
  Users, 
  Package, 
  PackagePlus, 
  Boxes 
} from 'lucide-react';
import { ServiceItem } from './types';
import React from 'react';

export const initialServices: ServiceItem[] = [
  {
    id: "service1",
    title: "Payroll Management",
    description: "Complete payroll processing and management services for your business.",
    icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
    price: "From €150/month",
    badges: [
      "Monthly payroll processing",
      "Tax calculations & filings",
      "Direct deposit setup",
      "Year-end reporting"
    ],
    popular: true,
    status: 'available'
  },
  {
    id: "service2",
    title: "Tax Advisory",
    description: "Professional tax planning and advisory services to minimize your tax burden.",
    icon: <FileText className="h-5 w-5 text-primary" />,
    price: "From €200/month",
    badges: [
      "Tax return preparation",
      "Tax planning strategies",
      "Audit support",
      "VAT compliance"
    ],
    status: 'available'
  },
  {
    id: "service3",
    title: "HR Management",
    description: "Comprehensive human resources services for employee management.",
    icon: <Users className="h-5 w-5 text-primary" />,
    price: "From €180/month",
    badges: [
      "Employee onboarding",
      "Benefits administration",
      "HR policy development",
      "Performance management"
    ],
    status: 'pending'
  },
  {
    id: "service4",
    title: "Bookkeeping Plus",
    description: "Enhanced bookkeeping services with detailed financial reporting.",
    icon: <Package className="h-5 w-5 text-primary" />,
    price: "From €120/month",
    badges: [
      "Daily transaction recording",
      "Monthly financial reports",
      "Accounts reconciliation",
      "Cash flow management"
    ],
    status: 'available'
  },
  {
    id: "service5",
    title: "Financial Analysis",
    description: "In-depth analysis of your financial data to support business decisions.",
    icon: <PackagePlus className="h-5 w-5 text-primary" />,
    price: "From €250/month",
    badges: [
      "Profitability analysis",
      "Investment evaluation",
      "Budget preparation",
      "Financial forecasting"
    ],
    status: 'completed'
  },
  {
    id: "service6",
    title: "Accounting Software Setup",
    description: "Setup and training for accounting software tailored to your business needs.",
    icon: <Boxes className="h-5 w-5 text-primary" />,
    price: "From €300 one-time",
    badges: [
      "Software selection guidance",
      "System configuration",
      "Data migration",
      "Staff training"
    ],
    status: 'rejected'
  }
];
