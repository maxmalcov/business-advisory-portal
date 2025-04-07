
import { useState } from 'react';
import { Service } from '@/integrations/supabase/client';

export interface ServiceFormState {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  iconName: string;
  setIconName: (iconName: string) => void;
  badges: string;
  setBadges: (badges: string) => void;
  popular: boolean;
  setPopular: (popular: boolean) => void;
  category: string;
  setCategory: (category: string) => void;
  status: 'active' | 'inactive';
  setStatus: (status: 'active' | 'inactive') => void;
  currentService: Service | null;
  resetForm: () => void;
  populateFormWithService: (service: Service) => void;
  getFormData: () => Omit<Service, 'id' | 'created_at' | 'updated_at'>;
}

export const useServiceForm = (): ServiceFormState => {
  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [iconName, setIconName] = useState<string>('Package');
  const [badges, setBadges] = useState<string>('');
  const [popular, setPopular] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Make sure state setters are properly typed and working
  const handleSetTitle = (value: string) => {
    console.log('Setting title to:', value);
    setTitle(value);
  };

  const handleSetDescription = (value: string) => {
    console.log('Setting description to:', value);
    setDescription(value);
  };

  const handleSetPrice = (value: string) => {
    console.log('Setting price to:', value);
    setPrice(value);
  };

  const handleSetIconName = (value: string) => {
    console.log('Setting iconName to:', value);
    setIconName(value);
  };

  const handleSetBadges = (value: string) => {
    console.log('Setting badges to:', value);
    setBadges(value);
  };

  const handleSetPopular = (value: boolean) => {
    console.log('Setting popular to:', value);
    setPopular(value);
  };

  const handleSetCategory = (value: string) => {
    console.log('Setting category to:', value);
    setCategory(value);
  };

  const handleSetStatus = (value: 'active' | 'inactive') => {
    console.log('Setting status to:', value);
    setStatus(value);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIconName('Package');
    setBadges('');
    setPopular(false);
    setCategory('');
    setStatus('active');
    setCurrentService(null);
  };

  const populateFormWithService = (service: Service) => {
    console.log('Populating form with service:', service);
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(service.price.toString());
    setIconName(service.iconName);
    setBadges(service.badges ? service.badges.join(', ') : '');
    setPopular(service.popular);
    setCategory(service.category || '');
    setStatus(service.status || 'active');
  };

  const getFormData = () => ({
    title,
    description,
    price: parseFloat(price),
    iconName,
    badges: badges.split(',').map(b => b.trim()).filter(b => b),
    popular,
    category: category || null,
    status
  });

  return {
    title,
    setTitle: handleSetTitle,
    description,
    setDescription: handleSetDescription,
    price,
    setPrice: handleSetPrice,
    iconName,
    setIconName: handleSetIconName,
    badges,
    setBadges: handleSetBadges,
    popular,
    setPopular: handleSetPopular,
    category,
    setCategory: handleSetCategory,
    status,
    setStatus: handleSetStatus,
    currentService,
    resetForm,
    populateFormWithService,
    getFormData
  };
};
