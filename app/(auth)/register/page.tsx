
import Link from "next/link";
import AuthForm from "@/app/components/auth/AuthForm";

export default function RegisterPage() {
    return (
        <>
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 mb-6 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-nunito">Create an account</h1>
                <p className="text-white/60 mt-2 font-nunito">Join thousands of teams shipping faster</p>
            </div>

            <AuthForm type="register" />

            <p className="mt-6 text-center text-sm text-white/50 font-nunito">
                Already have an account?{" "}
                <Link href="/login" className="text-white font-medium hover:underline transition">
                    Sign In
                </Link>
            </p>
        </>
    );
}
