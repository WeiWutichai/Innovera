
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/profile/ProfileForm";
import Navbar from "@/app/components/Navbar";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-neutral-950 pb-20">
            <Navbar />

            <div className="pt-32 px-6">
                <div className="max-w-2xl mx-auto text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-nunito mb-4">
                        Account Settings
                    </h1>
                    <p className="text-white/60 font-nunito">
                        Manage your profile information and security settings
                    </p>
                </div>

                <ProfileForm user={session.user} />
            </div>
        </main>
    );
}
