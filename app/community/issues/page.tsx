import { getMyProducts } from "@/app/actions/product";
import { getUnreadCountsByProduct } from "@/app/actions/notification";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import MyProductsList from "./MyProductsList";

export default async function IssuesPage() {
    const session = await auth();

    // Authorization check
    if (!session || !session.user) {
        redirect('/login?callbackUrl=/community/issues');
    }

    const myProducts = await getMyProducts();
    const notificationCounts = await getUnreadCountsByProduct();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="container mx-auto px-4 py-8">
                <Link href="/community" className="text-blue-600 hover:underline mb-4 block">&larr; Back to Community</Link>

                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-[#4B286D]">Manual of Documents and Problem Reporting</h1>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-[#4B286D]">
                                <span className="w-1.5 h-8 bg-[#4B286D] rounded-full"></span>
                                My Products
                            </h2>
                            <MyProductsList products={myProducts} notificationCounts={notificationCounts} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
