import { PaymentService } from "../../../services/PaymentService";

interface PaymentData {
    order: string;
    token: string;
    amount: number;
    mid: string;
  }
  
   export const makePayment = (paymentData: PaymentData,id:number): void => {

    console.log("paymentdata", paymentData)
    const config = {
      root: "",
      style: {
        bodyBackgroundColor: "#fafafb",
        bodyColor: "",
        themeBackgroundColor: "#0FB8C9",
        themeColor: "#ffffff",
        headerBackgroundColor: "#284055",
        headerColor: "#ffffff",
        errorColor: "",
        successColor: "",
        card: {
          padding: "",
          backgroundColor: "",
        },
      },
      data: {
        orderId: paymentData.order,
        token: paymentData.token,
        tokenType: "TXN_TOKEN",
        amount: paymentData.amount /* update amount */,
      },
      payMode: {
        labels: {},
        filter: {
          exclude: [],
        },
        order: ["CC", "DC", "NB", "UPI", "PPBL", "PPI", "BALANCE"],
      },
      website: "WEBSTAGING",
      flow: "DEFAULT",
      merchant: {
        mid: paymentData.mid,
        redirect: false,
      },
      handler: {
        transactionStatus:async (paymentStatus: any) => {
          const encoded = btoa(JSON.stringify({data:{
            orderId:paymentData.order, id: id, type:"paytm", data:{
                TXNID:paymentStatus?.TXNID,
                STATUS:paymentStatus?.STATUS
            }
        }}))
          sessionStorage.setItem("paymentStatus", JSON.stringify(paymentStatus));
            try {
              const res:any = await  PaymentService.updatePaymentStatus({data:encoded})
            } catch (error) {
              console.log("error While Making Payment", error);
            }
          if (paymentStatus.STATUS === "TXN_SUCCESS") {
            // Redirect to the successful payment component
            const windown:any = window;
            windown.Paytm.CheckoutJS.close();
            window.location.href = "/#/success";
          } else {
            // Redirect to the failed payment component
            windown.Paytm.CheckoutJS.close();
            window.location.href = "/#/failure";
          }
        },
        notifyMerchant: (eventName: string, data: any) => {
          console.log("event", eventName);
        },
      },
    };
    const windown:any = window;
    if (windown && windown.Paytm && windown.Paytm.CheckoutJS) {
      windown.Paytm.CheckoutJS.init(config)
        .then(() => {
          windown.Paytm.CheckoutJS.invoke();
        })
        .catch((error: any) => {
          console.log("Error => ", error);
        });
    }
    
  };
  
 