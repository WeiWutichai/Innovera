
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        console.log('No admin user found. Please run seed-admin.js first or create an admin.');
        return;
    }

    const posts = [
        {
            title: "The Future of Web Development",
            slug: "future-web-development",
            content: `
        <p>In the rapidly evolving landscape of web development, staying ahead of the curve is crucial. This article explores the latest trends transforming how we build and deploy web applications, from the rise of server-side rendering to the dominance of edge computing.</p>
        <h2>The Rise of React Server Components</h2>
        <p>React Server Components (RSC) represent a paradigm shift in how we think about rendering. By shifting logic to the server, we can reduce bundle sizes and improve initial load times significantly.</p>
        <h2>Next.js and the Full Stack</h2>
        <p>Next.js continues to blur the line between frontend and backend, offering robust API routes, middleware, and database integrations right out of the box.</p>
      `,
            excerpt: "Exploring the latest trends in React, Next.js, and modern frontend architecture.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop", // React generic image
            published: true,
            authorId: admin.id,
        },
        {
            title: "Building Scalable Systems",
            slug: "building-scalable-systems",
            content: `
         <p>Scalability isn't just about handling more traffic; it's about building systems that can grow and evolve without collapsing under their own weight.</p>
         <h2>Microservices vs Monoliths</h2>
         <p>The debate continues, but the answer often lies in the middle. Modular monoliths offer a great balance for many teams starting out.</p>
         <h2>Database Optimization</h2>
         <p>Indexing, caching strategies using Redis, and choosing the right database for the job (SQL vs NoSQL) are critical decisions.</p>
      `,
            excerpt: "Best practices for designing robust and scalable backend systems for enterprise.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop", // Tech generic
            published: true,
            authorId: admin.id,
        },
        {
            title: "Design Systems 101",
            slug: "design-systems-101",
            content: `
        <p>A design system is more than just a component library; it's the shared language of your product team.</p>
        <h2>Consistency is Key</h2>
        <p>By defining tokens for colors, typography, and spacing, you ensure that every part of your application feels cohesive.</p>
        <h2>Collaboration</h2>
        <p>Design systems bridge the gap between designers and developers, reducing friction and speeding up the handoff process.</p>
      `,
            excerpt: "How to create and maintain a consistent design language across your products.",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop", // Design generic
            published: true,
            authorId: admin.id,
        },
    ];

    for (const post of posts) {
        const existing = await prisma.post.findUnique({
            where: { slug: post.slug },
        });

        if (!existing) {
            await prisma.post.create({
                data: post,
            });
            console.log(`Created post: ${post.title}`);
        } else {
            console.log(`Post already exists: ${post.title}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
