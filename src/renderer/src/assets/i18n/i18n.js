import {initReactI18next} from 'react-i18next';
import en from './en.json';
import mm from './mm.json';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
  lng: 'mm',
  fallbackLng: 'en',
  resources: {
    en: en,
    mm: mm,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
