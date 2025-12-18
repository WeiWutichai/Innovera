import Link from 'next/link';
import { auth } from '@/auth';
import ProfileMenu from './ProfileMenu';

export default async function Navbar() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-stone-950/70 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="text-sm sm:text-base font-medium tracking-tight font-nunito text-white">Innovera</span>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm text-white/70 ml-auto mr-6">
                        <Link href="#service" className="hover:text-white transition-colors font-nunito">Service</Link>
                        <Link href="#platforms" className="hover:text-white transition-colors font-nunito">Platforms</Link>
                        <Link href="#site-reference" className="hover:text-white transition-colors font-nunito">Site Reference</Link>
                        <Link href="#blog" className="hover:text-white transition-colors font-nunito">Blog</Link>
                        <Link href="#contact" className="hover:text-white transition-colors font-nunito">Contact Us</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {session?.user ? (
                            <ProfileMenu user={session.user} />
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-flex items-center h-9 px-3 rounded-lg border border-white/10 text-sm text-white/80 hover:text-white hover:border-white/20 transition-colors font-nunito">
                                    Sign in
                                </Link>
                                <Link href="/register" className="inline-flex items-center h-9 px-3 rounded-lg bg-white text-stone-900 text-sm font-medium hover:bg-white/90 transition-colors font-nunito">
                                    Start free
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="ml-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
