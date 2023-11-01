import axios from "axios";
import { PaytmChecksum } from "../utils/paytmChecksum";
import dotenv from 'dotenv';
import { logger } from "../utils/logger";
dotenv.config()

export class PaytmGateway {
    async initiatePayment({ref_no,amount,email}){
        try{
            logger.info(`PAYTM payment initiated with payload---> orderId:${ref_no} amount: ${amount} email: ${email} `)
            const params: any = {};
            params.body = {
                "requestType": "Payment",
                "mid": process.env.PAYTM_MID,
                "websiteName": process.env.PAYTM_MERCHANT_WEBSITE,
                "orderId": ref_no,
                "callbackUrl": `${process.env.BASE_URL}/${process.env.CALL_BACK}`,
                "txnAmount": {
                    "value": amount,
                    "currency": "INR",
                },
                "userInfo": {
                    "custId": email,
                },
            }
            const checkSum = await PaytmChecksum.generateSignature(JSON.stringify(params.body), process.env.PAYTM_MERCHANT_KEY)
            params.head = {
                "signature": checkSum
            }
            const apiResult = await axios.post(`${process.env.PAYTM_BASE_URL}/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${ref_no}`, JSON.stringify(params), {
                headers: { 'Content-Type': 'application/json' }
            })
            logger.info(`PAYTM initiate payment api response---->apiresult:${JSON.stringify(apiResult?.data)}, apiParams:${JSON.stringify(params)}`)
            return apiResult?.data
        } catch(error){
            logger.error(`PAYTM payment initiation error---->error:${error.message}, orderId:${ref_no}}`)
            throw error
        }
    }
}

export interface PaymentProcessor {
    pay(payload:any): Promise<any>
}

export class PaytmGatewayAdapter implements PaymentProcessor {
    gateway: any;
    constructor(gateway) {
        this.gateway = gateway
    }
    async pay(payload) {
        return this.gateway.initiatePayment(payload)
    }
}