import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { logAuthEvent } from "../utils/logger";
import { Role } from "../types";

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "default_access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

export const login = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { mobile: identifier }
                ]
            }
        });

        if (!user || !user.isActive) {
            await logAuthEvent(null, "FAILED_LOGIN", `Attempt for identifier: ${identifier}`, "AUTH");
            return res.status(401).json({ message: "Invalid credentials or account disabled" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            await logAuthEvent(user.id, "FAILED_LOGIN", "Invalid password", "AUTH");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role as Role,
            name: user.name
        };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Store refresh token in DB for validation and secure logout
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        await logAuthEvent(user.id, "LOGIN_SUCCESS", "User logged in successfully", "AUTH");

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }

        if (req.user) {
            await logAuthEvent(req.user.id, "LOGOUT", "User logged out", "AUTH");
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error during logout" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    try {
        // Verify token exists in database
        const tokenDoc = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!tokenDoc) {
            return res.status(403).json({ message: "Invalid refresh token (not found or revoked)" });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const payload = {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name
            };

            const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
};
export const signup = async (req: Request, res: Response) => {
    const { username, mobile, password, name } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { mobile }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or mobile number already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                mobile,
                passwordHash,
                name,
                role: Role.VIEWER, // Strictly force Viewer role for public signup
                isActive: true
            }
        });

        await logAuthEvent(newUser.id, "USER_SIGNUP", "Viewer account created via public signup", "USER");

        res.status(201).json({
            message: "Account created successfully as Viewer",
            user: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    // This controller is intended for Admins creating other users
    const { username, mobile, password, name, role, department } = req.body;

    // Check if requester is Admin (middleware should handle this, but being extra safe)
    if (req.user?.role !== Role.ADMIN) {
        return res.status(403).json({ message: "Only admins can register other staff members" });
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { mobile }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or mobile number already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                mobile,
                passwordHash,
                name,
                role,
                department,
                isActive: true
            }
        });

        await logAuthEvent(req.user.id, "USER_CREATION", `Admin created user ${newUser.id} with role ${role}`, "USER");

        res.status(201).json({
            message: `User created successfully as ${role}`,
            user: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
