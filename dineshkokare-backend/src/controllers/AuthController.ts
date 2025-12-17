import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, inviter_id } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const result = await authService.register(name, email, password, role, inviter_id);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
