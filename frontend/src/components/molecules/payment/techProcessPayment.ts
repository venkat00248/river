import { PaymentService } from "../../../services/PaymentService"

export const techProcessPayment =(paymentDetails:any)=> {
    const ind:any = $ 

    console.log("payment", paymentDetails)
    // const {txnObj} = paymentDetails
    const {tokenObject} = paymentDetails
    const handleResponse = async (res:any)=>{
        // paymentMethod.paymentTransaction

        console.log("payment Res", res)
     const  data ={ 
        TXNID:res?.merchantTransactionIdentifier,
        TXNAMOUNT:res?.paymentMethod.paymentTransaction.amount,
        BANKTXNID:res?.paymentMethod.paymentTransaction.identifier
     }
        sessionStorage.setItem("paymentStatus", JSON.stringify(data));
        const windown:any = window;
        const trnxstatus = res.transactionState ;
        const redirection = trnxstatus==="S"?"/#/success":"/#/failure"

         //console.log("response tech", res)
           setTimeout(()=>{

            ind(".modalpage, #checkoutmodal").remove()
            windown.location.href= redirection
           },5000)

           if(res){
            try {
                const encoded = btoa(JSON.stringify({data:{
                    orderId:paymentDetails.orderId, id: paymentDetails?.id, type:"techprocess", data:{
                        TXNID:res?.merchantTransactionIdentifier,
                        STATUS:res?.transactionState
                    }
                }}))
                const response:any = await  PaymentService.updatePaymentStatus({data:encoded})
                //console.log("res", response)
              } catch (error) {
                console.log("error While Making Payment", error);
              }
           }
    }
    var configJson = {
        'tarCall': false,
        'features': {
            "showPGResponseMsg": true,
            "enableAbortResponse": true,
            "enableExpressPay": true,
            "enableInstrumentDeRegistration" : true,
            "enableMerTxnDetails": true,
            "enableNewWindowFlow": true    //for hybrid applications please disable this by passing false
        },
        "consumerData": {
            "deviceId": tokenObject.deviceId,    //possible values "WEBSH1" or "WEBSH2"
            "token": paymentDetails.token,
            // "returnUrl": "https://www.tekprocess.co.in/MerchantIntegrationClient/MerchantResponsePage.jsp",    //merchant response page URL
            "responseHandler": handleResponse,
            "paymentMode": "all",
            "merchantLogoUrl": "https://www.cloud4c.com/sites/default/files/cloud4c_0.png",  //provided merchant logo will be displayed
            "merchantId": paymentDetails.merchantId,
            "currency": "INR",
            "consumerId": tokenObject.consumerId,
            "consumerMobileNo": tokenObject.consumerMobileNo,
            "consumerEmailId": tokenObject.consumerEmailId,
            "txnId": tokenObject.txnId,   //Unique merchant transaction ID
            "items": [{
                "itemId": "first",
                "amount": tokenObject.totalamount,
                "comAmt": "0"
            }],
            "customStyle": {
                "PRIMARY_COLOR_CODE": "#45beaa",   //merchant primary color code
                "SECONDARY_COLOR_CODE": "#FFFFFF",   //provide merchant's suitable color code
                "BUTTON_COLOR_CODE_1": "#2d8c8c",   //merchant's button background color code
                "BUTTON_COLOR_CODE_2": "#FFFFFF"   //provide merchant's suitable color code for button text
            }
        }
    };
    // console.log("configJson --- ", configJson);
   
    ind.pnCheckout(configJson);

    if (configJson.features.enableNewWindowFlow) {
        (window as any).pnCheckoutShared.openNewWindow();
    }
}
