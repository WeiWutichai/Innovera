import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill setImmediate for Prisma/Next.js if needed
if (typeof global.setImmediate === 'undefined') {
    (global as any).setImmediate = (fn: any, ...args: any) => setTimeout(fn, 0, ...args);
}

