import { INTEGER, STRING, FLOAT, Sequelize, BIGINT, UUID, JSON } from 'sequelize';
import { sequelize } from '../config/dbConfig';
import dotenv from "dotenv";
const pathEnv = `.env.${process.env.NODE_ENV}`
dotenv.config({path: pathEnv});


export const transaction = sequelize.define(process.env.DB_TABLE_NAME, {
    id:{
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ref_no: {
        type: STRING,
        allowNull: true
    },
    name: {
        type: STRING,
        allowNull: true
    },
    amount: {
        type: STRING,
        allowNull: true
    },
    amount_taxes: {
        type: STRING,
        allowNull: true
    },
    cheque_no: {
        type: STRING,
        allowNull: true
    },
    cheque_date: {
        type: STRING,
        allowNull: true
    },
    bank_name: {
        type: STRING,
        allowNull: true
    },
    card_name: {
        type: STRING,
        allowNull: true
    },
    attachment_name: {
        type: STRING,
        allowNull: true
    },
    record_status: {
        type: INTEGER,
        allowNull: true
    },
    created_time: {
        type: INTEGER,
        allowNull: true
    },
    payment_type: {
        type: STRING,
        allowNull: true
    },
    status: {
        type: STRING,
        allowNull: true
    },
    ip_address: {
        type: STRING,
        allowNull: true
    },
    transaction_id: {
        type: STRING,
        allowNull: true
    },
    payment_id: {
        type: STRING,
        allowNull: true
    },
    createdby: {
        type: STRING,
        allowNull: true
    },
    emial: {
        type: STRING,
        allowNull: true
    },
    city: {
        type: STRING,
        allowNull: true
    },
    country: {
        type: STRING,
        allowNull: true
    },
    contact_no: {
        type: STRING,
        allowNull: true
    }
});

transaction.beforeCreate((trx:any) => {
      if(trx?.ip_address){
        trx.ip_address = btoa(trx?.ip_address)
      }
  });
