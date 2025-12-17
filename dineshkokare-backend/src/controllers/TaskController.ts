import { Response } from "express";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { Op } from "sequelize"; // Need to import Op for OR queries if needed

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, assignee_id } = req.body;
        const assigner_id = req.user?.id;

        if (!assigner_id) return res.status(401).json({ message: "Unauthorized" });

        const task = await Task.create({
            title,
            description,
            assignee_id,
            assigner_id,
            status: 'pending'
        });

        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { filter } = req.query; // 'assigned_by_me' | 'my_tasks'

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        let whereClause: any = {};

        if (filter === 'assigned_by_me') {
            whereClause = { assigner_id: userId };
        } else {
            // Default: My tasks (assigned TO me)
            whereClause = { assignee_id: userId };
        }

        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'assigner', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Authorization check: Only assignee or assigner can update? 
        // Usually assignee marks complete, assigner can verify.
        if (task.assignee_id !== req.user?.id && task.assigner_id !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
