import { Sequelize } from 'sequelize';
import dotenv from "dotenv"
import { decryptPassword } from '../utils/helpers';
const pathEnv = `.env.${process.env.NODE_ENV}`
dotenv.config({path: pathEnv});

export const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,  
    username: process.env.DB_USER,  //decrypting username from .env file with algorithm
    password: decryptPassword(process.env.DB_PASSWD), //decrypting password from .env file with algorithm
    dialectOptions:{
        connectTimeout: 1000
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define:{
        timestamps: false
    }
});