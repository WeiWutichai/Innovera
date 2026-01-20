
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            products: true
        }
    });

    console.log("Found users:", users.length);
    for (const user of users) {
        console.log(`User: ${user.email} (ID: ${user.id})`);
        console.log(`Role: ${user.role}`);
        console.log(`Assigned Products: ${user.products.length}`);
        user.products.forEach(p => {
            console.log(` - ${p.name} (ID: ${p.id})`);
        });
        console.log("---");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
