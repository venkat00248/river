import HttpApiService from "./HttpApiService";
import { config } from "../config/config";

//define the constants here...
const API_BASE = `${config.API.BASEURI}`;

 const workFlowAPI = "https://itsmworkflow.cloud4c.com/workflow/unpublished"
 const PaymentAPI = "https://paymentsapi-uat.cloud4c.com/payment"
 const UatPaymentAPI = "https://paymentsapi-uat.cloud4c.com"
//  const PaymentAPI = "https://paymentsapi-uat.cloud4c.com/payment"
 const PaytmAPI = "https://secure.paytm.in/oltp-web"

export class Payment extends HttpApiService {
  constructor() {
    super(`${API_BASE}`);
  } 
 
  makePayment = (data:any)=>{
    return this.post(`${PaymentAPI}/create`, data)
  }
  makePaytmPayment = (data:any)=>{
    return this.post(`${PaytmAPI}/processTransaction`, data)
  }
  updatePaymentStatus  = (data:any)=>{
    return this.post(`${PaymentAPI}/updatePaymentStatus`, data)
  }
  paymentFormSubmit = (data:any)=>{
    return this.post(`${UatPaymentAPI}/paymentForm/submit`, data)
  }
  paymentFormUpdate = (data:any)=>{
    return this.post(`${UatPaymentAPI}/paymentForm/update`, data)
  }
}

export const PaymentService = new Payment();
