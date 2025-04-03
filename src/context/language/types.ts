
// Languages
export type Language = 'es' | 'en' | 'ru';

// Context type
export type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};
