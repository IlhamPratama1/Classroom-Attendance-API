import Sequelize from 'sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../config';

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
    sequelize,
    Sequelize
};

export default DB;