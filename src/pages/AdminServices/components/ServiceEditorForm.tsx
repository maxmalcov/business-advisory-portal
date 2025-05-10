import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ServiceFormState } from '../hooks/useServiceForm';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface ServiceEditorFormProps {
  serviceForm: ServiceFormState;
  isEditMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ServiceEditorForm: React.FC<ServiceEditorFormProps> = ({
  serviceForm,
  isEditMode,
  onSubmit,
  onCancel,
}) => {
  // Debugging the form inputs and state updates
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: (value: string) => void,
  ) => {
    console.log('Input change:', e.target.name, e.target.value);
    setter(e.target.value);
  };

  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t('services.editor.title')}</Label>
        <Input
          id="title"
          name="title"
          placeholder={t('services.editor.title.placeholder')}
          value={serviceForm.title}
          onChange={(e) => handleInputChange(e, serviceForm.setTitle)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('services.editor.description')}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t('services.editor.description.placeholder')}
          value={serviceForm.description}
          onChange={(e) => handleInputChange(e, serviceForm.setDescription)}
          required
          rows={4}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">{t('services.editor.price')}</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder={t('services.editor.price.placeholder')}
          value={serviceForm.price}
          onChange={(e) => handleInputChange(e, serviceForm.setPrice)}
          required
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label htmlFor="iconName">{t('services.editor.icon')}</Label>
        <Select
          value={serviceForm.iconName}
          onValueChange={serviceForm.setIconName}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('services.editor.icon.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Package">
              {t('services.editor.icon.package')}
            </SelectItem>
            <SelectItem value="FileText">
              {t('services.editor.icon.document')}
            </SelectItem>
            <SelectItem value="Briefcase">
              {t('services.editor.icon.briefcase')}
            </SelectItem>
            <SelectItem value="Users">
              {t('services.editor.icon.users')}
            </SelectItem>
            <SelectItem value="CreditCard">
              {t('services.editor.icon.payment')}
            </SelectItem>
            <SelectItem value="Calendar">
              {t('services.editor.icon.calendar')}
            </SelectItem>
            <SelectItem value="Shield">
              {t('services.editor.icon.security')}
            </SelectItem>
            <SelectItem value="Star">
              {t('services.editor.icon.premium')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <Label htmlFor="badges">{t('services.editor.badges')}</Label>
        <Input
          id="badges"
          name="badges"
          placeholder={t('services.editor.badges.placeholder')}
          value={serviceForm.badges}
          onChange={(e) => handleInputChange(e, serviceForm.setBadges)}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">{t('services.editor.category')}</Label>
        <Input
          id="category"
          name="category"
          placeholder={t('services.editor.category.placeholder')}
          value={serviceForm.category}
          onChange={(e) => handleInputChange(e, serviceForm.setCategory)}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">{t('services.status.category')}</Label>
        <Select
          value={serviceForm.status}
          onValueChange={(value) =>
            serviceForm.setStatus(value as 'active' | 'inactive')
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t('services.status.category.placeholder')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              {t('services.status.active')}
            </SelectItem>
            <SelectItem value="inactive">
              {t('services.status.inactive')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Popular */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="popular"
          checked={serviceForm.popular}
          onCheckedChange={serviceForm.setPopular}
        />
        <Label htmlFor="popular">{t('services.popular')}</Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('services.form-action.cancel')}
        </Button>
        <Button type="submit">
          {isEditMode
            ? t('services.form-action.update')
            : t('services.form-action.create')}
        </Button>
      </div>
    </form>
  );
};
