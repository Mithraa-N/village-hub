import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
        const asset = await prisma.asset.create({
            data: req.body
        });
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: "Error creating asset" });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const asset = await prisma.asset.update({
            where: { id: id as string },
            data: req.body
        });
        res.json(asset);
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
        const complaint = await prisma.complaint.create({
            data: req.body
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Error creating complaint" });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, resolvedDate, assignedTo } = req.body;
    try {
        const complaint = await prisma.complaint.update({
            where: { id: id as string },
            data: { status, resolvedDate, assignedTo }
        });
        res.json(complaint);
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
        const entry = await prisma.budgetEntry.create({
            data: req.body
        });
        res.status(201).json(entry);
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

