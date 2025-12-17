import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Invitation } from "./Invitation";
import { Task } from "./Task";

export enum UserRole {
    LEADER = "leader",
    MEMBER = "member",
}

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;

    @Column({ type: DataType.ENUM(...Object.values(UserRole)), defaultValue: UserRole.MEMBER })
    role!: UserRole;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    inviter_id!: number | null;

    @BelongsTo(() => User, "inviter_id")
    inviter!: User;

    @HasMany(() => User, "inviter_id")
    team!: User[];

    @HasMany(() => Task, "assignee_id")
    assignedTasks!: Task[];

    @HasMany(() => Task, "assigner_id")
    createdTasks!: Task[];

    @HasMany(() => Invitation)
    invitations!: Invitation[];
}
