
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-blue-500/30 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

                    {/* Floating Cards content matching reference */}
                    <div className="absolute bottom-12 left-12 right-12 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/46c1c487-d923-41a3-b3e4-6c293d89f0fe_320w.jpg" className="w-8 h-8 rounded-full border border-white/20" alt="User" />
                                <div>
                                    <p className="text-white text-xs font-bold font-nunito">Sarah Chen</p>
                                    <p className="text-white/60 text-[10px] font-nunito">@sarahdigital</p>
                                </div>
                            </div>
                            <p className="text-white/80 text-xs font-nunito leading-relaxed">
                                Amazing platform! The user experience is seamless and the features are exactly what I needed.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bcaefeee-31cd-4c69-9a33-39ee0ad78c30_320w.jpg" className="w-8 h-8 rounded-full border border-white/20" alt="User" />
                                <div>
                                    <p className="text-white text-xs font-bold font-nunito">Marcus Johnson</p>
                                    <p className="text-white/60 text-[10px] font-nunito">@marcustech</p>
                                </div>
                            </div>
                            <p className="text-white/80 text-xs font-nunito leading-relaxed">
                                This service has transformed how I work. Clean design, powerful features, and excellent support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
