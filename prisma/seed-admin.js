
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@innovera.com';
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Seeding admin user...');

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
    });

    console.log('Admin user created/updated:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
