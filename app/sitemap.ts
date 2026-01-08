import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma'; // Make sure this path is correct based on your project

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://innovera.co.th'; // Replace with your actual domain

    // Get all published posts
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    });

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...postUrls,
    ];
}
