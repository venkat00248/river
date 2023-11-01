import { Request, Response } from "express";
import { errorConstants } from "../Constants/errors";
import { PaymentForm } from "../models/form.model";
import _ from "lodash"

export async function submitPaymentForm(req:Request, res:Response) {
    try{
        let details: any = JSON.parse(atob(req.body.data));
        const { ref_no, name, city, email, amount, country, contact_no } = details
        if (!ref_no || !contact_no || !amount || !email || !name || !country || !city ) {
            throw new Error(errorConstants.BAD_REQUEST)
        }
        const form = await PaymentForm.create({...details})
        const data = btoa(JSON.stringify({
            form: form
        }))
        res.status(200).json({
            data:data
        })
    } catch(error){
        res.status(500).json({ error: 'Internal Server Error',message: error?.message })
    }
}

export async function getPaymentForm(req:Request, res:Response){
    try{
      const paymentId = JSON.parse(atob(req?.params?.id));
      const paymentFormDetails = await PaymentForm.findById(paymentId)
      if(!paymentFormDetails) throw new Error(errorConstants?.PAYMENT_FORM_NOT_FOUND)
      const data = btoa(JSON.stringify({
        form: paymentFormDetails
    }))
      res.status(200).json({
        data:data
      })
    } catch(error){
        res.status(200).json({
            errpr:"Internal server error",
            message: error?.message
        })
    }
}

export async function updatePaymentForm(req: Request, res:Response) {
    try{
      let details: any = JSON.parse(atob(req.body.data));
      const {payment_id, updatePayload} = details
      if(!payment_id || _.isEmpty(updatePayload)) throw new Error(errorConstants.BAD_REQUEST)
      const updatedForm = await PaymentForm.findOneAndUpdate({_id:payment_id},{$set:{...updatePayload}},{new: true})
      if(!updatedForm) throw new Error(errorConstants.PAYMENT_FORM_UPDATION_FAILED)
      const data = btoa(JSON.stringify({
        form: updatedForm
    }))
      res.status(200).json({
        data: data
      })
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error',message: error?.message })
    }
}