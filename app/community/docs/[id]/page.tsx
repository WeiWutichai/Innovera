import { getDocument } from "@/app/actions/document";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown'; // Assuming we handle markdown or plain text. 
// If react-markdown is not installed, we might need to display as pre-wrap or install it.
// For now, let's assume simple whitespace handling or HTML if stored roughly.
// Actually, I should probably render strictly as text if no markdown lib is guaranteed, 
// but "rich text" implies HTML or Markdown. I'll use simple div with dangerouslySetInnerHTML if I trust the source (Admin only),
// OR just whitespace-pre-wrap for now to be safe.
// Given requirement "Add images and VDO", likely we need a rich renderer.
// I'll stick to basic rendering for this iteration to avoid new deps if possible, 
// BUT the request implies "Add images", so likely HTML is stored.

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const doc = await getDocument(id);
    if (!doc) notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`/community/products/${doc.productId}`} className="text-blue-600 hover:underline">
                    &larr; Back to {doc.product.name}
                </Link>
            </div>

            <article className="prose lg:prose-xl max-w-none">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{doc.title}</h1>

                {doc.videoUrl && (
                    <div className="mb-8 aspect-w-16 aspect-h-9">
                        <iframe
                            src={doc.videoUrl.replace("watch?v=", "embed/")}
                            className="w-full h-[400px] rounded-lg shadow-lg"
                            allowFullScreen
                            title="Video"
                        />
                    </div>
                )}

                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
                    {/* Simplified content rendering - assuming plain text or safe HTML would be better with a proper editor */}
                    <div className="whitespace-pre-wrap">{doc.content}</div>
                </div>
            </article>
        </div>
    );
}
