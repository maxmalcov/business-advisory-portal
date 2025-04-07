
import { useState } from 'react';
import { Service } from '@/integrations/supabase/client';

export const useServiceForm = () => {
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
