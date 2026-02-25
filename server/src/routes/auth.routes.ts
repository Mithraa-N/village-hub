import { Router } from "express";
import { login, logout, refreshToken, signup } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh", refreshToken);
router.post("/logout", authenticateToken, logout);

export default router;

