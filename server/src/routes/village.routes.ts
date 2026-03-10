import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { Role } from "../types";
import { registerUser } from "../controllers/auth.controller";
import { getUsers, toggleUserStatus } from "../controllers/user.controller";
import {
    getAssets, createAsset, updateAsset,
    getComplaints, createComplaint, updateComplaintStatus,
    getBudgets, createBudgetEntry, getDashboardSummary, getAuditLogs, getReports
} from "../controllers/village.controller";

const router = Router();

// Dashboard Summary
router.get("/dashboard/stats", authenticateToken, getDashboardSummary);

// User Management
router.get("/users", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), getUsers);
router.post("/users", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), registerUser);
router.patch("/users/:id/status", authenticateToken, authorizeRoles(Role.ADMIN), toggleUserStatus);

// Assets
router.get("/assets", authenticateToken, getAssets);
router.post("/assets", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), createAsset);
router.patch("/assets/:id", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), updateAsset);

// Complaints
router.get("/complaints", authenticateToken, getComplaints);
router.post("/complaints", authenticateToken, createComplaint);
router.patch("/complaints/:id/status", authenticateToken, authorizeRoles(Role.ADMIN, Role.OPERATOR), updateComplaintStatus);

// Budgets
router.get("/budgets", authenticateToken, authorizeRoles(Role.ADMIN), getBudgets);
router.post("/budgets", authenticateToken, authorizeRoles(Role.ADMIN), createBudgetEntry);

// Audit Logs
router.get("/audit-logs", authenticateToken, authorizeRoles(Role.ADMIN), getAuditLogs);

// Reports
router.get("/reports", authenticateToken, authorizeRoles(Role.ADMIN), getReports);

export default router;


