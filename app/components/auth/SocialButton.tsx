
"use client";
import { signIn } from "next-auth/react";

import { useSearchParams } from "next/navigation";

export default function SocialButton({ provider, children }: { provider: string, children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    return (
        <button
            onClick={() => signIn(provider, { callbackUrl })}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition-all font-nunito text-sm font-medium backdrop-blur-sm"
        >
            {children}
        </button>
    );
}
