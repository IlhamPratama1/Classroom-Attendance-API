import { Model, Sequelize, DataTypes, Optional, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { User, Role, Attendance } from '../interfaces';

export type UserCreationAttributes = Optional<User, 'id'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare deskripsi: string;
    declare picture: string;

    declare getRoleModels: BelongsToManyGetAssociationsMixin<Role>;
    declare setRoleModels: BelongsToManySetAssociationsMixin<Role, number>;

    declare getAttendanceModels: HasManyGetAssociationsMixin<Attendance>;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            username: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(45)
            },
            email: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(255)
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            deskripsi: {
                type: DataTypes.STRING(255)
            },
            picture: {
                type: DataTypes.STRING(255)
            }
        },
        {
            tableName: 'users',
            sequelize
        }
    );

    return UserModel;
}

