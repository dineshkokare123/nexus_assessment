import { Router } from "express";
import { inviteContact, getInvitations } from "../controllers/InvitationController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.post("/", inviteContact);
router.get("/", getInvitations);

export default router;
