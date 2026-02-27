import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logAuditEvent } from "../utils/logger";

const prisma = new PrismaClient();

// ASSETS
export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await prisma.asset.findMany({
            include: { complaints: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assets" });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const { name, category, ward, location, condition, responsibleRole } = req.body;
        if (!name || !category || !ward || !location || !condition || !responsibleRole) {
            return res.status(400).json({ message: "Validation Error: All mandatory fields are required." });
        }

        const asset = await prisma.asset.create({
            data: req.body
        });
        res.status(201).json(asset);
        await logAuditEvent(req.user?.id || "SYSTEM", req.user?.role || "SYSTEM", "CREATE_ASSET", "Asset Registry", asset.id, `Created asset: ${asset.name}`);
    } catch (error) {
        res.status(500).json({ message: "Error creating asset" });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { condition } = req.body;

        if (condition === "Working" || condition === "Operational") {
            const openComplaints = await prisma.complaint.count({
                where: {
                    assetId: id as string,
                    OR: [
                        { status: "Submitted" },
                        { status: "Assigned" },
                        { status: "In Progress" }
                    ]
                }
            });
            if (openComplaints > 0) {
                return res.status(400).json({ message: "Validation Error: An asset marked 'Working' must not have an open repair record." });
            }
        }

        const asset = await prisma.asset.update({
            where: { id: id as string },
            data: req.body
        });
        res.json(asset);
        await logAuditEvent(req.user?.id || "SYSTEM", req.user?.role || "SYSTEM", "UPDATE_ASSET", "Asset Registry", asset.id, `Updated asset details`);
    } catch (error) {
        res.status(500).json({ message: "Error updating asset" });
    }
};

// COMPLAINTS
export const getComplaints = async (req: Request, res: Response) => {
    try {
        const complaints = await prisma.complaint.findMany({
            include: { asset: true },
            orderBy: { submittedDate: 'desc' }
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints" });
    }
};

export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { title, description, category, ward, submittedBy } = req.body;
        if (!title || !description || !category || !ward || !submittedBy) {
            return res.status(400).json({ message: "Validation Error: All mandatory fields are required." });
        }

        const complaint = await prisma.complaint.create({
            data: req.body
        });
        res.status(201).json(complaint);
        await logAuditEvent(req.user?.id || "SYSTEM", req.user?.role || "SYSTEM", "CREATE_COMPLAINT", "Grievance Redressal", complaint.id, `Created complaint: ${complaint.title}`);
    } catch (error) {
        res.status(500).json({ message: "Error creating complaint" });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, resolvedDate, assignedTo, closingRemark } = req.body;
    try {
        if (["Resolved", "Closed"].includes(status)) {
            if (!closingRemark || closingRemark.trim() === "") {
                return res.status(400).json({ message: "Validation Error: A complaint cannot be closed without a closing remark." });
            }
        }

        const complaint = await prisma.complaint.update({
            where: { id: id as string },
            data: { status, resolvedDate, assignedTo, closingRemark }
        });
        res.json(complaint);
        await logAuditEvent(req.user?.id || "SYSTEM", req.user?.role || "SYSTEM", "UPDATE_COMPLAINT_STATUS", "Grievance Redressal", complaint.id, `Status updated to: ${status}`);
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint" });
    }
};

// BUDGET
export const getBudgets = async (req: Request, res: Response) => {
    try {
        const budgets = await prisma.budgetEntry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching budget entries" });
    }
};

export const createBudgetEntry = async (req: Request, res: Response) => {
    try {
        const { category, allocated, spent = 0, linkedActivity, fiscalYear } = req.body;

        if (!category || allocated === undefined || !linkedActivity || !fiscalYear) {
            return res.status(400).json({ message: "Validation Error: Mandatory fields are required." });
        }

        if (spent > allocated) {
            return res.status(400).json({ message: "Validation Error: Budget spent must never exceed budget allocated." });
        }

        const entry = await prisma.budgetEntry.create({
            data: req.body
        });
        res.status(201).json(entry);
        await logAuditEvent(req.user?.id || "SYSTEM", req.user?.role || "SYSTEM", "CREATE_BUDGET_ENTRY", "Budget Management", entry.id, `Allocated ${entry.allocated} to ${entry.category}`);
    } catch (error) {
        res.status(500).json({ message: "Error creating budget entry" });
    }
};

// DASHBOARD SUMMARY
export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const [
            totalAssets,
            faultyAssets,
            openComplaints,
            budgetStats
        ] = await Promise.all([
            prisma.asset.count(),
            prisma.asset.count({
                where: {
                    condition: { in: ["Minor Issue", "Major Fault", "Under Repair"] }
                }
            }),
            prisma.complaint.count({
                where: {
                    status: { in: ["Submitted", "Assigned", "In Progress"] }
                }
            }),
            prisma.budgetEntry.aggregate({
                _sum: {
                    allocated: true,
                    spent: true
                }
            })
        ]);

        const totalAllocated = budgetStats._sum.allocated || 0;
        const totalSpent = budgetStats._sum.spent || 0;
        const utilizationPercent = totalAllocated > 0
            ? Math.round((totalSpent / totalAllocated) * 100)
            : 0;

        // Recent Activity
        const recentComplaints = await prisma.complaint.findMany({
            take: 5,
            orderBy: { submittedDate: 'desc' },
            include: { asset: { select: { name: true } } }
        });

        const faultyAssetsList = await prisma.asset.findMany({
            where: {
                condition: { in: ["Minor Issue", "Major Fault", "Under Repair"] }
            },
            take: 5,
            orderBy: { updatedAt: 'desc' }
        });

        res.json({
            stats: {
                totalAssets,
                faultyAssets,
                openComplaints,
                totalSpent,
                utilizationPercent
            },
            recentComplaints,
            faultyAssets: faultyAssetsList
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating dashboard summary" });
    }
};

// AUDIT LOGS
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching audit logs", error);
        res.status(500).json({ message: "Error fetching audit logs" });
    }
};

