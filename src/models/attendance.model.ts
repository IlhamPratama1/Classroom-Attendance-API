import { Model, Sequelize, DataTypes, Optional, BelongsToSetAssociationMixin } from 'sequelize';
import { Attendance, User } from '../interfaces';

export type AttendanceCreationAttributes = Optional<Attendance, 'id'>;

export class AttendanceModel extends Model<Attendance, AttendanceCreationAttributes> implements Attendance {
    declare id: number;
    declare image: string;
    declare position: string;
    declare date: Date;
    declare time: Date;
    declare type: string;
    declare status: string;

    declare setUserModel: BelongsToSetAssociationMixin<User, number>;
}

export default function (sequelize: Sequelize): typeof AttendanceModel {
    AttendanceModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            image: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            position: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            type: {
                allowNull: false,
                defaultValue: "wfo",
                type: DataTypes.ENUM("wfo", "wfh"),
            },
            status: {
                allowNull: false,
                defaultValue: "nothing",
                type: DataTypes.ENUM("datang", "pergi", "nothing"),
            }
        },
        {
            tableName: 'attendances',
            sequelize
        }
    );

    return AttendanceModel;
}