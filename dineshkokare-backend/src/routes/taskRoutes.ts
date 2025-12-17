import { Router } from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/TaskController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTaskStatus);

export default router;
