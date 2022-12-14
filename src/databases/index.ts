import Sequelize from 'sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../config';
import AttendanceModel from '../models/attendance.model';
import roleModel from '../models/role.model';
import userModel from '../models/user.models';

const sequelize = new Sequelize.Sequelize(DB_DATABASE as string, DB_USER as string, DB_PASSWORD as string, {
    host: DB_HOST,
    dialect: 'postgres',
    port: Number(DB_PORT),
    pool: {
        max: 5,
        min: 0
    }
});

const DB = {
    Users: userModel(sequelize),
    Roles: roleModel(sequelize),
    Attendance: AttendanceModel(sequelize),
    sequelize,
    Sequelize
};

// #region User Assoc
DB.Users.belongsToMany(DB.Roles, { through: "userRoles" });
DB.Users.hasMany(DB.Attendance);
// #endregion

// #region Roles Assoc
DB.Roles.belongsToMany(DB.Users, { through: "userRoles" });
// #endregion

// #region Attendance Assoc
DB.Attendance.belongsTo(DB.Users);
// #endregion

export default DB;