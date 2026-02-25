import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { Role } from "../types";
import { registerUser } from "../controllers/auth.controller";

const router = Router();

// Dashboard - Accessible to all authenticated users
router.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to Village Hub Dashboard", user: req.user });
});

// Assets - Operators and Admins can update
router.post("/assets", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), (req, res) => {
    res.json({ message: "Asset created/updated successfully" });
});

// Budgets - Admins only
router.post("/budgets", authenticateToken, authorizeRoles(Role.ADMIN), (req, res) => {
    res.json({ message: "Budget record modified successfully" });
});

// User Management - Admin only, prevent privilege escalation
router.post("/users", authenticateToken, authorizeRoles(Role.ADMIN), registerUser);

export default router;

