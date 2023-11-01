# Techprocess payment gateway integration
## Prerequsites
> we need to have an account with techprocess and get the merchant ID, Scheme Code, Device ID, SALT(Unique for each merchant)

## step 0:
> Create the following payload to generate the checksum 
```json
let txnObj = {
    "merchantId": "merchant_id", 
    "schemeCode": "scheme_code",
    "deviceId": "device_id",
    "currency": "INR",
};
```
```json
let tokenObject = {
    "txnId": "transactionId",
    "totalamount": "amount",
    "accountNo": "",
    "consumerId":"consumerId",
    "consumerMobileNo": "contact_no",
    "consumerEmailId": "email",
    "debitStartDate": "debitStartDate",
    "debitEndDate": "debitEndDate",
    "maxAmount": "maxAmount",
    "amountType": "amountType",
    "frequency": "frequency",
    "cardNumber": "cardNumber",
    "expMonth": "expMonth",
    "expYear": "expYear",
    "cvvCode": "cvvCode"
                    
};          
```
## step 1: 
>Generate checksum by posting the above objects with SALT, token, transaction ID and transaction object and post the checksum to frontend 

``` let hashInput = txnObj.merchantId + '|';

    for (var key in tokenObject) {
        hashInput += tokenObject[key] + '|';
        }

    hashInput += process.env.SALT; //salt key is unique for a merchant

        const token = sha512(hashInput); //method to create a token
        const data = btoa(JSON.stringify({
          merchantId: txnObj?.merchantId,
          token: token,
          txnId: tokenObject?.txnId,
          tokenObject: tokenObject
     }))
```

## step 2:
>create the following object in the frontend
```
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
            "deviceId": deviceId,    //possible values "WEBSH1" or "WEBSH2"
            "token": token,
            // "returnUrl": "https://www.tekprocess.co.in/MerchantIntegrationClient/MerchantResponsePage.jsp",    //merchant response page URL
            "responseHandler": handleResponse,// where you want to handle the response from the gateway, It could be returnUrl or responseHandler
            "paymentMode": "all",
            "merchantLogoUrl": "https://www.paynimo.com/CompanyDocs/company-logo-vertical.png",  //provided merchant logo will be displayed
            "merchantId": merchantId,
            "currency": "INR",
            "consumerId": consumerId,
            "consumerMobileNo": consumerMobileNo,
            "consumerEmailId": consumerEmailId,
            "txnId": transactionId,   //Unique merchant transaction ID
            "items": [{
                "itemId": "first",
                "amount": totalamount,
                "comAmt": "0"
            }],
          //custom color styling depending on the website theme 
            "customStyle": {
                "PRIMARY_COLOR_CODE": "#45beaa",   //merchant primary color code
                "SECONDARY_COLOR_CODE": "#FFFFFF",   //provide merchant's suitable color code
                "BUTTON_COLOR_CODE_1": "#2d8c8c",   //merchant's button background color code
                "BUTTON_COLOR_CODE_2": "#FFFFFF"   //provide merchant's suitable color code for button text
            }
        }
    };
```
## step 3:
>call the techprocess function pnCheckout with the configJson that we created above.
    ind.pnCheckout(configJson);
    if (configJson.features.enableNewWindowFlow) {
        (window as any).pnCheckoutShared.openNewWindow();
    }
}

## step 4: 
> handle the response from techprocess as declared in the configJson object 

1. "returnUrl": "https://www.tekprocess.co.in/MerchantIntegrationClient/MerchantResponsePage.jsp", //merchant response page URL


2."responseHandler": handleResponse,// where you want to handle the response from the gateway, It could be returnUrl or responseHandler 

>Sample responseHandler:
```
 const handleResponse =(res:any)=>{
        // paymentMethod.paymentTransaction
     const  data ={ 
        TXNID:res?.merchantTransactionIdentifier,
        TXNAMOUNT:res?.paymentMethod.paymentTransaction.amount,
        BANKTXNID:res?.paymentMethod.paymentTransaction.identifier
     }
        sessionStorage.setItem("paymentStatus", JSON.stringify(data));
        const windown:any = window;
        const trnxstatus = res.transactionState ;
        const redirection = trnxstatus==="S"?"/#/success":"/#/failure" //redirection page

        // console.log("response tech", res)
           setTimeout(()=>{

            ind(".modalpage, #checkoutmodal").remove()
            windown.location.href= redirection
           },5000)
    }
```

## References
[1]. [Techprocess Documentation] (https://paynimo.com/paynimocheckout/docs/#online)