import React, { useContext, useEffect, useState } from "react";
import "./Payment.scss";
import { useFormData } from "./stateManagement/FormDataContext";
import PaymentContext from "./stateManagement/PaymentContext";
import { PaymentService } from "../../../services/PaymentService";
import { makePayment } from "./makepayment";
import { techProcessPayment } from "./techProcessPayment";

export const Review = () => {
  const { review, setReview, selectedPayment, setSelectedPayment } =
    useContext(PaymentContext);
  const { orderDetails, userDetails, location, mongoId } = useFormData();
  const [isRecaptchaVerified, setRecaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const siteKey = "6Lf_CGYnAAAAAO64b2-DBE50Y9XR8oYze-fvh88e"
  const uatSitekey = "6LeeEGAnAAAAAKovhYCYzDJup28I4WYPejZvuiTn"
  const handlePaymentOptionChange = async (event: any) => {
    setSelectedPayment(event.target.value);    
    try{
      sessionStorage.paymentType = event.target.value;
      const updatedData = { updatePayload: {payment_type:event.target.value}, payment_id: mongoId};
      const encodedUpdatedData = btoa(JSON.stringify(updatedData));
      await PaymentService.paymentFormUpdate({data:encodedUpdatedData});
    }
    catch(error){
      console.error("Error posting or updating data:", error);
    }
  };
  console.log("ssssss", userDetails);
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://www.google.com/recaptcha/api.js?render=6LeryVonAAAAAONG1NjlqRx40ZmbroNaf38_mN6F";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const handleScriptLoad = () => {
    // The script has been loaded successfully
    console.log("Script loaded!");
  };

  const addScript = () => {
    const script1 = document.createElement("script");
    script1.src =
      "https://www.paynimo.com/paynimocheckout/client/lib/jquery.min.js"; // Replace with the actual path of your script
    script1.onload = handleScriptLoad;
    document.body.appendChild(script1);
    const script = document.createElement("script");
    script.src =
      "https://www.paynimo.com/Paynimocheckout/server/lib/checkout.js"; // Replace with the actual path of your script
    script.onload = handleScriptLoad;
    document.body.appendChild(script);
  };

  const paymentHandler = async () => {
    //  addScript()
    if (!selectedPayment) {
      // No payment method is selected, show an error message or take appropriate action.
      setErrorMsg("Please select a payment method before proceeding.");
      return;
    }
    setErrorMsg("");
    
    const data = {
      ref_no: orderDetails.orderId,
      name: userDetails.name,
      city: location.city,
      email: userDetails.email,
      amount: orderDetails.amount,
      country: location.country,
      contact_no: userDetails.contact,
      payment_type: selectedPayment,
      payment_form_id:mongoId
    };
    //const stringfy = JSON.stringify(data)
    const encode = btoa(JSON.stringify(data));
    // console.log("encode", encode)
    // console.log("reverse",JSON.parse(atob(encode)));

    if (selectedPayment === "techprocess") {
      try{
      setIsLoading(true);
      const res: any = await PaymentService.makePayment({ data: encode });
      if (res) {
        addScript();
      }
      // console.log('response===========',res.data.data)
      const decode = JSON.parse(atob(res.data.data));
      //  console.log("logg", decode)

      techProcessPayment(decode);
      setIsLoading(false);
    } catch (error) {
      console.log("error While Making Payment", error);
    }
    } else if (selectedPayment === "paytm") {
      try {
        setIsLoading(true);
        const res: any = await PaymentService.makePayment({ data: encode });
        const decode = JSON.parse(atob(res.data.data));
        makePayment({
          order: orderDetails.orderId,
          token: decode.txnToken,
          amount: orderDetails.amount,
          mid: decode.mid,
        },decode?.id);
        setIsLoading(false);
      } catch (error) {
        console.log("error While Making Payment", error);
      }
    }
  };
  useEffect(() => {
    // Google reCAPTCHA Script
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    const windown: any = window;
    windown.handleRecaptchaVerify = handleRecaptchaVerify;
    windown.handleRecaptchaExpired = handleRecaptchaExpired;
    

    return () => {
      // Clean up the script when the component is unmounted
      document.body.removeChild(script);
      delete windown.handleRecaptchaVerify;
      delete windown.handleRecaptchaExpired;
    };
  }, []);
  const handleRecaptchaVerify = () => {
    setRecaptchaVerified(true);
  };
  const handleRecaptchaExpired = () => {
    setRecaptchaVerified(false);
  };
  console.log("verify", isRecaptchaVerified);
  return (
    <main>
      <div className="container px-0">
        <div className="signup-content d-flex">
          <section className="signup-form">
            <header className="d-flex justify-content-between">
              <h4>Review</h4>
            </header>
            <form
              className="register-form px-5 py-2 needs-validation"
              id="register-form"
            >
              <fieldset className="scheduler-border mb-2 pb-1">
                <legend className="scheduler-border">Order Details</legend>
                <div className="control-group">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label d-block mb-1 fw-medium boldTittle">
                        Order Id / Quotation No / Invoice No
                      </label>
                      <label className="form-label mb-1 d-block">
                        {orderDetails.orderId}
                      </label>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1 d-block fw-medium boldTittle">
                        Amount
                      </label>
                      <label className="form-label mb-1 d-block">
                        {orderDetails.amount}
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="scheduler-border mb-2 pb-1">
  <legend className="scheduler-border">User Details</legend>
  <div className="control-group">
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          Name
        </label>
        <div className="form-label-wrap">
          {userDetails.name}
        </div>
      </div>
      <div className="col-md-5">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          Email
        </label>
        <div className="form-label-wrap">
          {userDetails.email}
        </div>
      </div>
      <div className="col-md-3">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          Contact
        </label>
        <div className="form-label-wrap">
          {userDetails.contact}
        </div>
      </div>
    </div>
  </div>
</fieldset>
              <fieldset className="scheduler-border mb-2 pb-1">
  <legend className="scheduler-border">Location</legend>
  <div className="control-group">
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          Address
        </label>
        <div className="form-label-wrap">
          {location.address}
        </div>
      </div>
      <div className="col-md-3">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          City
        </label>
        <div className="form-label-wrap">
          {location.city}
        </div>
      </div>
      <div className="col-md-3">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          State
        </label>
        <div className="form-label-wrap">
          {location.state}
        </div>
      </div>
      <div className="col-md-2">
        <label className="form-label mb-1 d-block fw-medium boldTittle">
          Postal Code
        </label>
        <div className="form-label-wrap">
          {location.postalCode}
        </div>
      </div>
    </div>
  </div>
</fieldset>

              <fieldset className="scheduler-border mb-2 pb-1">
                <legend className="scheduler-border">
                  Select Payment Gateway
                </legend>
                <div className="control-group">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <div className="selectpay">
                        <div className="form-label d-block fw-medium mb-0 pt-1 mt-1">
                          <img src="assets/img/techprocess-logo.jpg" />
                        </div>
                        <label>
                          <input
                            type="radio"
                            name="radio"
                            value="techprocess"
                            checked={selectedPayment === "techprocess"}
                            onChange={handlePaymentOptionChange}
                          />
                          <span>Tech Process</span>
                        </label>
                        <div className="form-label d-block fw-medium mb-0 pt-1 mt-1">
                          <img src="assets/img/paytm-logo.jpg" />
                        </div>
                        <label>
                          <input
                            type="radio"
                            name="radio"
                            value="paytm"
                            checked={selectedPayment === "paytm"}
                            onChange={handlePaymentOptionChange}
                          />
                          <span>Paytm</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              {errorMsg && (
                <span style={{ color: "#d32f2f", marginLeft: "25px" }}>
                  {errorMsg}
                </span>
              )}
              <div
                className="captchaWrapper"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <div
                  className="g-recaptcha"
                  data-sitekey={uatSitekey}
                  data-callback="handleRecaptchaVerify"
                  data-expired-callback="handleRecaptchaExpired"
                />
              </div>
              <div className="row py-2">
                <div className="col-6">
                  <div className="backbtn">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setReview(true);
                      }}
                    >
                      {" "}
                      <span>Back</span>
                    </button>
                  </div>
                </div>
                <div className="col-6">
                  <div className="submit confirmpay">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={paymentHandler}
                      disabled={!isRecaptchaVerified}
                    >
                      {isLoading && <div className="ld ld-left ld-spin"></div>}
                      <span>Confirm & Pay</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="row w-100 copyright pt-2">
                <div className="col-md-12">
                  <div className="d-block">
                    ©{" "}
                    <a
                      href="http://www.cloud4c.com"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Cloud4C Service Pvt Ltd{" "}
                    </a>
                    2007- 2023.(A division of
                    <a
                      href="http://www.ctrls.in"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      CtrlS Data Centers
                    </a>
                    )
                    <div>
                      All product names, logos, and brands are property of their
                      respective owners. All company, product and service names
                      used in this website are for identification purposes only.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};
