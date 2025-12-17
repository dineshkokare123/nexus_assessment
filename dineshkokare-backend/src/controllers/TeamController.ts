import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { Invitation } from "../models/Invitation";

export const getTeam = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Get direct recruits
        const teamMembers = await User.findAll({
            where: { inviter_id: userId },
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            include: [
                { model: Invitation, as: 'invitations' } // Maybe we don't need this here
            ]
        });

        // Get pending invitations
        const pendingInvitations = await Invitation.findAll({
            where: { inviter_id: userId, status: 'pending' }
        });

        res.json({
            members: teamMembers,
            pending_invitations: pendingInvitations,
            stats: {
                total_members: teamMembers.length,
                pending_invites: pendingInvitations.length
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const teamMembers = await User.findAll({ where: { inviter_id: userId } });
        const pendingInvitations = await Invitation.findAll({ where: { inviter_id: userId, status: 'pending' } });

        // Calculate task completion rate for the team
        // This is a simplified calculation: (Completed Tasks / Total Tasks assigned by me)
        const Task = require('../models/Task').Task; // Dynamic import to avoid circular dependency issues if any
        const totalTasks = await Task.count({ where: { assigner_id: userId } });
        const completedTasks = await Task.count({ where: { assigner_id: userId, status: 'completed' } });

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            stats: {
                total_members: teamMembers.length,
                pending_invites: pendingInvitations.length,
                completion_rate: completionRate,
                active_members: teamMembers.length // For this MVP, all members are "active"
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
