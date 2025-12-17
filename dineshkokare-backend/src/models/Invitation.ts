import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

export enum InvitationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined",
}

@Table({ tableName: "invitations", timestamps: true })
export class Invitation extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    phone_number!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.ENUM(...Object.values(InvitationStatus)), defaultValue: InvitationStatus.PENDING })
    status!: InvitationStatus;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    inviter_id!: number;

    @BelongsTo(() => User)
    inviter!: User;
}
