import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import ru from './locales/ru';

export type AppLanguage = 'ru' | 'en';

/** Device language normalized to a supported app language (fallback: English). */
export function deviceLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode ?? 'en';
  return code === 'ru' ? 'ru' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  // Initial language is the device locale. If the user previously picked a
  // language, the settings store applies it on rehydration (see settingsStore).
  lng: deviceLanguage(),
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
