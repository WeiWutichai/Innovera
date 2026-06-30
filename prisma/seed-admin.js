
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@innovera.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error(
            'ERROR: ADMIN_PASSWORD environment variable is required.\n' +
            "Run with: ADMIN_PASSWORD='<strong-password>' node prisma/seed-admin.js"
        );
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Seeding admin user...');

    const user = await prisma.user.upsert({
        where: { email },
        // Do NOT reset the password on re-run; only ensure name/role.
        update: {
            name: 'Admin',
            role: 'ADMIN',
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
            isApproved: true,
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
