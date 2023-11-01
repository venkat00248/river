import { Request, Response } from "express";
//import { transaction } from "../models/transactionDetailsModel";
import { errorConstants } from "../Constants/errors";
import { fetchCurrentTime } from "../utils/helpers";
import { PaytmGateway, PaytmGatewayAdapter } from "../adapters/paytmAdapter";
import { apiConstants } from "../Constants/apiConstants";
import { logger } from "../utils/logger";
import { PaymentForm } from "../models/form.model";
import _ from "lodash";
import { transaction } from "../models/transactionDetailsModel";

enum PaymentType{
  PAYTM = "paytm",
  TECHPROCESS = "techprocess"
}

export async function initiateTransaction(req: Request, res: Response) {
    
    const details = req['data']
    logger.info(`user from submitted with details ${JSON.stringify(details)}`)
    const { ref_no, name, city, email, amount, country, contact_no, payment_type } = details
    if (!payment_type) throw new Error()
    if (!ref_no || !contact_no || !amount || !email || !details?.payment_form_id || !name || !city || !country) {
        throw new Error(errorConstants.BAD_REQUEST)
    } else {
        try {
            const paymentFormDetails:any = await PaymentForm.findById(details?.payment_form_id)
            if(!paymentFormDetails) throw new Error(errorConstants.PAYMENT_FORM_NOT_FOUND)
            const {_id,createdAt,updatedAt,__v,...restFormDetails} = paymentFormDetails?._doc
            const {payment_form_id, ...restApiPayload} = details
            if(!_.isEqual(restFormDetails,restApiPayload)) throw new Error(errorConstants?.PAYMENT_FORM_TAMPERED) 
            const date = fetchCurrentTime()
            //Need to be un commented on adding uat db credentials in .env file
            let transactionResult:any = await transaction.create({ ref_no: ref_no || "", name: name || "", city: city || "", emial: email || "", amount: amount || "", country: country || "", contact_no: contact_no || "", record_status: 1, created_time: date })
            transactionResult = transactionResult.toJSON()
            if (payment_type === PaymentType.PAYTM) {
                try {
                    //const result: any = await processPayment({ amount, email, ref_no })
                    const paytmGateway = new PaytmGateway()
                    const paytmAdapter = new PaytmGatewayAdapter(paytmGateway)
                    const result = await paytmAdapter.pay({ amount, email, ref_no })
                    const resultMsg = result?.body?.resultInfo?.resultStatus
                    if (resultMsg !== apiConstants.PAYTM_INITIATION_SUCESS) throw new Error(errorConstants.PAYMENT_INITIATION_ERROR)
                    const data = btoa(JSON.stringify({
                        mid: process.env.PAYTM_MID,
                        txnToken: result?.body?.txnToken,
                        host: process.env.PAYTM_BASE_URL,
                        amount: amount,
                        id: transactionResult?.id
                    }))
                    res.status(200).json({
                        success: true,
                        data: data
                    })
                } catch (error) {
                    logger.error(`error in main controller ${error.message} orderId:${ref_no} ${amount} ${contact_no} PAYTM`)
                    res.status(500).json({ error: error.message })
                }
            }
            else if (payment_type === PaymentType.TECHPROCESS) {
                const sha512 = require('js-sha512');
                let txnObj = {
                    merchantId: process.env.CCMERCODE, //test 'T3583' live - 'L3583', 
                    schemeCode: process.env.SCHEME_CODE,
                    deviceId: process.env.DEVICE_ID,
                    currency: process.env.CURRENCY,
                };
                let tokenObject = {
                    txnId: new Date().getTime(),
                    totalamount: amount,
                    accountNo: '',
                    consumerId: req?.body?.consumerId || '',
                    consumerMobileNo: contact_no || '',
                    consumerEmailId: email || '',
                    debitStartDate: req?.body?.debitStartDate || '',
                    debitEndDate: req?.body?.debitEndDate || '',
                    maxAmount: req?.body?.maxAmount || '',
                    amountType: req?.body?.amountType || '',
                    frequency: req?.body?.frequency || '',
                    cardNumber: req?.body?.cardNumber || '',
                    expMonth: req?.body?.expMonth || '',
                    expYear: req?.body?.expYear || '',
                    cvvCode: req?.body?.cvvCode || ''
                };

                let hashInput = txnObj.merchantId + '|';

                for (var key in tokenObject) {
                    hashInput += tokenObject[key] + '|';
                }

                hashInput += process.env.CCKEY; //salt key.Unique for a merchant

                const token = sha512(hashInput); //method to create a token
                const data = btoa(JSON.stringify({
                    merchantId: txnObj?.merchantId,
                    token: token,
                    txnId: tokenObject?.txnId,
                    tokenObject: tokenObject,
                    orderId: ref_no,
                    id: transactionResult?.id
                }))
                logger.info(`Initiated techprocess payment with the following payload ${JSON.stringify(tokenObject)}`)
                res.status(200).json({
                    data: data
                })
            }
        } catch (e) {
            logger.error(`internal server error ${e.message} orderId:${ref_no} ${amount} ${contact_no} PAYTM`)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}

export async function updatePaymentStatus(req: Request, res: Response) {
    const details = req['data']
    try {
        const{orderId, type, data,id} = details?.data
        if (!data || !orderId || !type) throw new Error(errorConstants.BAD_REQUEST)
        logger.info(`updating payment status with following details ${JSON.stringify(details)}`)
        let msg = ""
        if(data?.STATUS === apiConstants?.PAYTM_SUCESS || data?.STATUS === apiConstants?.TECHPROCESS_SUCCESS) {
            msg = apiConstants.SUCCESS
        }
        if(data?.STATUS === apiConstants?.TECHPROCESS_FAILURE || data?.STATUS === apiConstants?.PAYTM_FAILURE) {
            msg = apiConstants.FAILURE
        }
        let result:any = await transaction.update({
            transaction_id: data?.TXNID,
            payment_type: type,
            status: msg
        }, {
            where: { id: id }
        })
        res.status(200).json({
            success: true,
            data: "updated successfully"
        })
    } catch (error) {
        logger.error(`error in update status api ${details?.type}----->error:${error.message}, orderId:${details?.orderId}, TXNID:${details?.data?.TXNID || details?.data?.txnId}`)
        res.status(500).json({
            success: false,
            data: error.message
        })
    }
}


