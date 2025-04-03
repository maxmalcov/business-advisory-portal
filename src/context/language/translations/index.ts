
import { Language } from '../types';
import { enTranslations } from './en';
import { esTranslations } from './es';
import { ruTranslations } from './ru';

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
  ru: ruTranslations
};
