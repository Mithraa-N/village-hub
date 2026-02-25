import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role } from "../types";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                mobile: true,
                name: true,
                role: true,
                department: true,
                isActive: true,
                createdAt: true,
                lastLogin: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id as string },
            data: { isActive },
            select: { id: true, isActive: true }
        });


        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user status" });
    }
};
