# paytm payment gateway integration process-I documentation

## Prerequsites
> merchantid,websitename,merchantkey are needed to do the paytm gateway integration, by registering the company with paytm 

## step 0: 
> Install & Import paytmchecksum
     
    install paytmchecksum;
    const PaytmChecksum = require('paytmchecksum');
         
## step 1: 
> Initiate the transaction with the following parameters 
```json
{
    "paytmParams": {
        "requestType": "Payment",
        "mid": "merchantId",
        "websiteName": "websiteName",
        "orderId": "ORDERID_9876519",
        "callbackUrl": "yourcallbackURL",
        "txnAmount": {
            "value": "1.00",
            "currency": "INR",
        },
        "userInfo": {
            "custId": "CUST_001", //optional
            "custName": "test_customer", //optional
            "cust_email": "test@gmail.com" //optional
        }
    }
}
```
> call paytm generate signature function with above generated paload, which will return checksum 

    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), 'merchantKey').then(function (checksum) {
        console.log(checksum)
    }
## step 2: 
> set checksum in head as signature and post data to generate transaction token
       
    paytmParams.head = {
            "signature": checksum
        };
        var post_data = JSON.stringify(paytmParams);
        var options = {
            /* for Staging */
            hostname: 'paytm base staging URL',
            /* for Production */
            // hostname: 'paytm base production URL',
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=merchantId&orderId=orderId',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
    };
## step 3:
> Make a form post with transactionToken,merchantId,orderId to the following URL

    https://secure.paytm.in/theia/api/v1/showPaymentPage?mid=merchantId&orderId=orderId

## step 4:
> Above step will return HTML, to which we need to redirect the user to make the payment on  paytm payment gateway

## step 5:
> Once payment is done paytm will call the callback url that we specified while generating checksum and will update the status of the transaction 


## Paytm base url's:

- [securegw-stage.paytm.in]- Staging URL
- [securegw.paytm.in] - Production URL


## References: 

[1]. [Overview of payment processing via transaction token]
 (https://business.paytm.com/docs/show-payment-page?ref=payments) 

[2]. [Initiate Payment]  (https://business.paytm.com/docs/jscheckout-initiate-payment?ref=jsCheckoutdoc)

[3]. [Invoke Payment]  (https://business.paytm.com/docs/jscheckout-invoke-payment?ref=jsCheckoutdoc)

[4]. [Verify Payment]  (https://business.paytm.com/docs/jscheckout-verify-payment?ref=jsCheckoutdoc)





# paytm payment gateway integration process-II documentation

## step 0: 
> Install & Import paytmchecksum
     
    install paytmchecksum;
    const PaytmChecksum = require('paytmchecksum');
         
## step 1: 
> Initiate the transaction with the following parameters 
```json
{
    "paytmParams": {
        "requestType": "Payment",
        "mid": "merchantId",
        "websiteName": "websiteName",
        "orderId": "ORDERID_9876519",
        "callbackUrl": "yourcallbackURL",
        "txnAmount": {
            "value": "1.00",
            "currency": "INR",
        },
        "userInfo": {
            "custId": "CUST_001", //optional
            "custName": "test_customer", //optional
            "cust_email": "test@gmail.com" //optional
        }
    }
}
```
> call paytm generate signature function with above generated paload, which will return checksum 

    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), 'merchantKey').then(function (checksum) {
        console.log(checksum)
    }
## step 2: 
> set checksum in head as signature and post data to generate transaction token
       
    paytmParams.head = {
            "signature": checksum
        };
        var post_data = JSON.stringify(paytmParams);
        var options = {
            /* for Staging */
            hostname: 'paytm base staging URL',
            /* for Production */
            // hostname: 'paytm base production URL',
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=merchantId&orderId=orderId',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
    };

## step 3: 
> Checksum will be sent to frontend and from the frontend a the following script will be executed which will handle the payment process from paytm and listens to the transaction status 

```<script type="application/javascript" src="{HOST}/merchantpgpui/checkoutjs/merchants/{MID}.js" onload="onScriptLoad();" crossorigin="anonymous"></script>
<script>
  function onScriptLoad(){
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": "ORDER_34563", /* update order id */
          "token": "jjndjsdshj3rqk", /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": "1" /* update amount */
        },
        "handler": {
          "notifyMerchant": function(eventName,data){
            console.log("notifyMerchant handler function called");
            console.log("eventName => ",eventName);
            console.log("data => ",data);
          } 
        }
      };

      if(window.Paytm && window.Paytm.CheckoutJS){
          window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
              // initialze configuration using init method 
              window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
                  // after successfully updating configuration, invoke JS Checkout
                  window.Paytm.CheckoutJS.invoke();
              }).catch(function onError(error){
                  console.log("error => ",error);
              });
          });
      } 
  }
</script>

```
## step 4:
Status of the payment will be sent to the backend.

## Sample Response 

sample output:
```json
{
    "head": {
        "responseTimestamp": "1553496322922",
        "version": "v1",
        "clientId": "C11",
        "signature": "xxxxx"
    },
    "body": {
        "resultInfo": {
            "resultStatus": "TXN_SUCCESS",
            "resultCode": "01",
            "resultMsg": "Txn Success"
        },
        "txnId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "bankTxnId": "xxxxxxxxxxxxxxx",
        "orderId": "xxxxxxx",
        "txnAmount": "1.00",
        "txnType": "SALE",
        "gatewayName": "HDFC",
        "bankName": "HSBC",
        "mid": "xxxxxxxxxxxxxxxxxxxx",
        "paymentMode": "CC",
        "refundAmt": "1.00",
        "txnDate": "2019-02-20 12:35:20.0",
        "authRefId": "50112883"
    }
}
```                  

## Error Codes:
- [errorCodes] - Payment status codes

[errorCodes]: <https://developer-assets.paytm.com/sftp/upload/cmsuploads/Transaction_response_codes_and_messages_78114f80f6.pdf>

## References:
[1]. [Initiate Payment]  (https://business.paytm.com/docs/jscheckout-initiate-payment?ref=jsCheckoutdoc)

[2]. [Payment Processing from Frontend] (https://business.paytm.com/docs/jscheckout-invoke-payment/)