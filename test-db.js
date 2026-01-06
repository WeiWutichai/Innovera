
const { PrismaClient } = require('@prisma/client');

// Explicitly pass the connection string with 127.0.0.1
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://user:password@127.0.0.1:5432/innovera',
        },
    },
});

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Connection successful (127.0.0.1). User count:', users.length);
    } catch (e) {
        console.error('Connection failed (127.0.0.1):', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
