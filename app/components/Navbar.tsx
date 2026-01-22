import { auth } from '@/auth';
import NavbarContent from './NavbarContent';

export default async function Navbar() {
    let session;
    try {
        session = await auth();
    } catch (error) {
        console.error("Navbar Auth Error:", error);
        session = null;
    }

    return <NavbarContent user={session?.user} />;
}
