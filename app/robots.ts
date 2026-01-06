import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://innovera.co.th'; // Replace with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Disallow admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
