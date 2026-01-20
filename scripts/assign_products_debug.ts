
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 3; // admin@innovera.co.th

    // Get all products
    const products = await prisma.product.findMany();
    const productIds = products.map(p => ({ id: p.id }));

    console.log(`Assigning ${products.length} products to user ${userId}...`);

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                connect: productIds
            }
        },
        include: { products: true }
    });

    console.log(`User ${user.email} now has ${user.products.length} products:`);
    user.products.forEach(p => console.log(` - ${p.name}`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
