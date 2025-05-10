import { useState, useCallback } from 'react';
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

  // Direct state setters without any wrapping logic
  const handleSetTitle = useCallback((value: string) => setTitle(value), []);
  const handleSetDescription = useCallback(
    (value: string) => setDescription(value),
    [],
  );
  const handleSetPrice = useCallback((value: string) => setPrice(value), []);
  const handleSetIconName = useCallback(
    (value: string) => setIconName(value),
    [],
  );
  const handleSetBadges = useCallback((value: string) => setBadges(value), []);
  const handleSetPopular = useCallback(
    (value: boolean) => setPopular(value),
    [],
  );
  const handleSetCategory = useCallback(
    (value: string) => setCategory(value),
    [],
  );
  const handleSetStatus = useCallback(
    (value: 'active' | 'inactive') => setStatus(value),
    [],
  );

  const resetForm = useCallback(() => {
    console.log('Resetting form');
    setTitle('');
    setDescription('');
    setPrice('');
    setIconName('Package');
    setBadges('');
    setPopular(false);
    setCategory('');
    setStatus('active');
    setCurrentService(null);
  }, []);

  const populateFormWithService = useCallback((service: Service) => {
    console.log('Populating form with service:', service);
    setCurrentService(service);
    setTitle(service.title || '');
    setDescription(service.description || '');
    setPrice(service.price?.toString() || '');
    // Map the database iconname to our form's iconName
    setIconName(service.iconName || 'Package');
    setBadges(service.badges ? service.badges.join(', ') : '');
    setPopular(!!service.popular);
    setCategory(service.category || '');
    setStatus(service.status || 'active');
  }, []);

  const getFormData = useCallback(
    () => ({
      title,
      description,
      price: parseFloat(price) || 0,
      iconName, // This will be mapped to iconname in the saveService function
      badges: badges
        .split(',')
        .map((b) => b.trim())
        .filter((b) => b),
      popular,
      category: category || null,
      status,
    }),
    [title, description, price, iconName, badges, popular, category, status],
  );

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
    getFormData,
  };
};
