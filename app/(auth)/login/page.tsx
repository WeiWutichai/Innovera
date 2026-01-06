
import Link from "next/link";
import AuthForm from "@/app/components/auth/AuthForm";

export default function LoginPage() {
    return (
        <>
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 mb-6 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-nunito">Welcome back</h1>
                <p className="text-white/60 mt-2 font-nunito">Access your account and continue your journey with us</p>
            </div>

            <AuthForm type="login" />

            <p className="mt-6 text-center text-sm text-white/50 font-nunito">
                New to our platform?{" "}
                <Link href="/register" className="text-white font-medium hover:underline transition">
                    Create Account
                </Link>
            </p>
        </>
    );
}
