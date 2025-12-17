import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from "./routes/authRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import teamRoutes from "./routes/teamRoutes";
import taskRoutes from "./routes/taskRoutes";

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Naxum Assessment API Running");
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        // Sync models (alter: true updates schema without drop)
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();

export default app;
