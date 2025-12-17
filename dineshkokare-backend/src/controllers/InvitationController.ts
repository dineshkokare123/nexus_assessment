import { Response } from "express";
import { Invitation } from "../models/Invitation";
import { AuthRequest } from "../middleware/auth";

export const inviteContact = async (req: AuthRequest, res: Response) => {
    try {
        const { phone, name } = req.body;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const inviter_id = req.user.id;

        // Check if pending invitation exists?
        // For now, allow multiple or just create.

        const invitation = await Invitation.create({
            phone_number: phone,
            name,
            inviter_id,
            status: 'pending'
        });

        res.status(201).json(invitation);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getInvitations = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const invitations = await Invitation.findAll({
            where: { inviter_id: req.user.id }
        });
        res.json(invitations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
