import mongoose from 'mongoose';
import dotenv from 'dotenv';
const pathEnv = `.env.${process.env.NODE_ENV}`
dotenv.config({path: pathEnv});

export const connect = async() =>{
    try{
    await mongoose.connect(process.env.DB_URI!)
    } catch(err){
        throw err
    }
}