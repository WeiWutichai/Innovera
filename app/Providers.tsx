"use client";

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
