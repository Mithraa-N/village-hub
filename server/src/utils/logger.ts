import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const logAuditEvent = async (
    userId: string,
    userRole: string,
    action: string,
    moduleName: string, // Changed parameter name internally to avoid naming collision but maps to 'module'
    recordId?: string,
    details?: string
) => {
    console.log(`[AUDIT] ${new Date().toISOString()} | User: ${userId} (${userRole}) | Module: ${moduleName} | Action: ${action} | Record: ${recordId || 'N/A'}`);

    try {
        await prisma.auditLog.create({
            data: {
                userId,
                userRole,
                action,
                module: moduleName,
                recordId,
                details,
            },
        });
    } catch (error) {
        console.error("Failed to write to official audit log:", error);
    }
};
