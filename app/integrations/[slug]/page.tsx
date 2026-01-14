

import React from 'react';
import { notFound } from 'next/navigation';
import { getIntegrationBySlug, getAllIntegrationSlugs } from '@/data/integrations';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import IntegrationHero from '@/app/components/integrations/IntegrationHero';
import PlatformFeatures from '@/app/components/platforms/PlatformFeatures';
import PlatformBenefits from '@/app/components/platforms/PlatformBenefits';
import PlatformCTA from '@/app/components/platforms/PlatformCTA';

export async function generateStaticParams() {
    const slugs = getAllIntegrationSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const integration = getIntegrationBySlug(slug);

    if (!integration) {
        return {
            title: 'Integration Not Found - Innovera',
        };
    }

    return {
        title: `${integration.name} Integration - Innovera`,
        description: integration.description,
        openGraph: {
            title: `${integration.name} Integration - Innovera`,
            description: integration.description,
        },
    };
}

export default async function IntegrationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const integration = getIntegrationBySlug(slug);

    if (!integration) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <IntegrationHero
                name={integration.name}
                tagline={integration.tagline}
                description={integration.description}
                icon={integration.icon}
                color={integration.color}
                gradient={integration.gradient}
                supportedItems={integration.supportedItems}
            />

            <PlatformFeatures
                features={integration.features}
                color={integration.color}
            />

            <PlatformBenefits
                benefits={{
                    title: integration.benefits.title,
                    items: integration.benefits.items
                }}
                useCases={[
                    {
                        title: 'Seamless Integration',
                        description: `Connect ${integration.name} with Innovera workflows.`
                    }
                ]}
                color={integration.color}
            />

            <PlatformCTA
                platformName={integration.name}
                color={integration.color}
                gradient={integration.gradient}
            />

            <Footer />
        </main>
    );
}
