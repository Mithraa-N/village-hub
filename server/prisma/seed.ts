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

    // SEED ASSETS
    console.log("Seeding Assets...");
    const school = await prisma.asset.create({
        data: {
            name: "Government Primary School",
            category: "School",
            ward: "Ward 04",
            location: "Near Main Square",
            condition: "Working",
            responsibleRole: "ADMIN"
        }
    });

    const well = await prisma.asset.create({
        data: {
            name: "Community Borewell 02",
            category: "Water Point",
            ward: "Ward 07",
            location: "East End",
            condition: "Major Fault",
            responsibleRole: "OPERATOR"
        }
    });

    await prisma.asset.create({
        data: {
            name: "Panchayat Road A",
            category: "Road",
            ward: "Ward 01",
            location: "Village Entrance",
            condition: "Minor Issue",
            responsibleRole: "OPERATOR"
        }
    });

    // SEED COMPLAINTS
    console.log("Seeding Complaints...");
    await prisma.complaint.create({
        data: {
            title: "School Roof Leakage",
            description: "Water dripping during rains in Grade 3 classroom.",
            category: "Infrastructure",
            status: "Assigned",
            submittedBy: "Rajesh Kumar",
            assignedTo: "Village Operator",
            ward: "Ward 04",
            assetId: school.id
        }
    });

    await prisma.complaint.create({
        data: {
            title: "Borewell Pump Failure",
            description: "Pump making loud noise and no water output.",
            category: "Water",
            status: "Submitted",
            submittedBy: "Anita Devi",
            ward: "Ward 07",
            assetId: well.id
        }
    });

    // SEED BUDGET
    console.log("Seeding Budget...");
    await prisma.budgetEntry.create({
        data: {
            category: "Education",
            allocated: 500000,
            spent: 120000,
            pending: 30000,
            linkedActivity: "School Maintenance",
            fiscalYear: "2025-26"
        }
    });

    await prisma.budgetEntry.create({
        data: {
            category: "Water & Sanitation",
            allocated: 800000,
            spent: 450000,
            pending: 100000,
            linkedActivity: "Handpump Repairs",
            fiscalYear: "2025-26"
        }
    });

    console.log("Full Seed Data Created Successfully.");
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
