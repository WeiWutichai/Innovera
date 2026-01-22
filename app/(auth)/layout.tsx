
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-950">
            {/* Left Side - Form Area */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>

            {/* Right Side - Visual Area */}
            <div className="hidden lg:block relative p-4">
                <div className="absolute inset-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4dcbc3ae-9030-4976-b771-f70080b92f09_1600w.jpg')] bg-cover bg-center"></div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 via-purple-600/40 to-blue-600/40 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                </div>
            </div>
        </div>
    );
}
