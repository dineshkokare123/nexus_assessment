import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

export enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
}

@Table({ tableName: "tasks", timestamps: true })
export class Task extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description!: string;

    @Column({ type: DataType.ENUM(...Object.values(TaskStatus)), defaultValue: TaskStatus.PENDING })
    status!: TaskStatus;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    assignee_id!: number;

    @BelongsTo(() => User, "assignee_id")
    assignee!: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    assigner_id!: number;

    @BelongsTo(() => User, "assigner_id")
    assigner!: User;
}
