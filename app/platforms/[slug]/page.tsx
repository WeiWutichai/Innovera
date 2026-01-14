import { notFound } from 'next/navigation';
import { getPlatformBySlug, getAllPlatformSlugs } from '@/data/platforms';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import PlatformHero from '@/app/components/platforms/PlatformHero';
import PlatformFeatures from '@/app/components/platforms/PlatformFeatures';
import PlatformBenefits from '@/app/components/platforms/PlatformBenefits';
import PlatformPricing from '@/app/components/platforms/PlatformPricing';
import PlatformCTA from '@/app/components/platforms/PlatformCTA';

export async function generateStaticParams() {
    const slugs = getAllPlatformSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const platform = getPlatformBySlug(slug);

    if (!platform) {
        return {
            title: 'Platform Not Found - Innovera',
        };
    }

    return {
        title: `${platform.name} - Innovera`,
        description: platform.description,
        openGraph: {
            title: `${platform.name} - Innovera`,
            description: platform.description,
        },
    };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const platform = getPlatformBySlug(slug);

    if (!platform) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <PlatformHero
                name={platform.name}
                tagline={platform.tagline}
                description={platform.description}
                icon={platform.icon}
                color={platform.color}
                gradient={platform.gradient}
            />

            <PlatformFeatures
                features={platform.features}
                color={platform.color}
            />

            <PlatformBenefits
                benefits={platform.benefits}
                useCases={platform.useCases}
                color={platform.color}
            />

            <PlatformPricing
                pricing={platform.pricing}
                color={platform.color}
            />

            <PlatformCTA
                platformName={platform.name}
                color={platform.color}
                gradient={platform.gradient}
            />

            <Footer />
        </main>
    );
}
