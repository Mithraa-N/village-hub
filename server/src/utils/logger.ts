import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const logAuthEvent = async (userId: string | null, action: string, details?: string, resource?: string) => {
    console.log(`[AUTH_LOG] ${new Date().toISOString()} | User: ${userId || 'GUEST'} | Action: ${action} | Details: ${details || 'N/A'}`);

    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details,
                resource,
            },
        });
    } catch (error) {
        console.error("Failed to write to audit log:", error);
    }
};
