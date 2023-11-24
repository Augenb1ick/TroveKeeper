import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import languages from './languagesConfig.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
    }
}

interface CustomTypeOptions {
    returnNull: false;
}

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init<CustomTypeOptions>({
        resources: languages as Resource,
        fallbackLng: 'en',
        returnNull: false,
        debug: false,
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
            format: (
                value: string | undefined,
                format: string | undefined
            ): string => {
                if (!value || !format) return '';
                return format === 'lowercase' ? value.toLowerCase() : value;
            },
        },
    });

export default i18n;
