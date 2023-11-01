import { Schema, model } from 'mongoose'
//import { task } from './task.model';

interface IPaymentForm {
    ref_no: string, 
    name: string, 
    city: string, 
    email: string, 
    amount: string, 
    country: string, 
    contact_no: string, 
    payment_type: string
}

export const paymentFormSchema = new Schema<IPaymentForm>({
    payment_type: {
        type: String
    },
    ref_no: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    } 
},{timestamps: true})

export const PaymentForm = model<IPaymentForm>('PaymentForm', paymentFormSchema) 