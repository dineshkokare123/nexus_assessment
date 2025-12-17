import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User";

export class AuthService {
    async register(name: string, email: string, password: string, role: UserRole = UserRole.MEMBER, inviter_id?: number) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            inviter_id,
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    private generateToken(user: User) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
    }
}
