import { Router } from "express";
import { getTeam, getDashboardStats } from "../controllers/TeamController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", getTeam);
router.get("/stats", getDashboardStats);

export default router;
