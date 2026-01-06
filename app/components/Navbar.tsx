import { auth } from '@/auth';
import NavbarContent from './NavbarContent';

export default async function Navbar() {
    const session = await auth();

    return <NavbarContent user={session?.user} />;
}
