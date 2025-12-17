import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User, Task, Invitation } from "../models";

dotenv.config();

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "naxum_db",
    logging: false,
    models: [User, Task, Invitation],
});
