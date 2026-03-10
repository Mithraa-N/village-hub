const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const assets = await prisma.asset.count();
    console.log('Total Assets in DB:', assets);
    process.exit(0);
}

check();
