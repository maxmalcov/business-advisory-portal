
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [badges, setBadges] = useState('');
  const [popular, setPopular] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [currentService, setCurrentService] = useState<Service | null>(null);

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
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    iconName,
    setIconName,
    badges,
    setBadges,
    popular,
    setPopular,
    category,
    setCategory,
    status,
    setStatus,
    currentService,
    resetForm,
    populateFormWithService,
    getFormData
  };
};
