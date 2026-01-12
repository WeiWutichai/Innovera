import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill setImmediate for Prisma/Next.js if needed
if (typeof global.setImmediate === 'undefined') {
    (global as any).setImmediate = (fn: any, ...args: any) => setTimeout(fn, 0, ...args);
}

// Mock LanguageContext globally
import { dictionary } from './app/locales/dictionary';

jest.mock('@/app/context/LanguageContext', () => ({
    useLanguage: () => ({
        language: 'en',
        t: dictionary.en,
        setLanguage: jest.fn(),
        toggleLanguage: jest.fn(),
    }),
    LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));
