import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminPassword = "AdminPassword123!";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            name: "System Administrator",
            passwordHash: hash,
            role: "ADMIN",
            isActive: true,
        },
    });

    console.log("Seed data created:");
    console.log("Admin User: admin / AdminPassword123!");

    const operatorPassword = "OperatorPassword123!";
    const opHash = await bcrypt.hash(operatorPassword, salt);

    await prisma.user.upsert({
        where: { username: "operator" },
        update: {},
        create: {
            username: "operator",
            name: "Village Operator",
            passwordHash: opHash,
            role: "OPERATOR",
            isActive: true,
        },
    });

    console.log("Operator User: operator / OperatorPassword123!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
