import React from 'react'
import './index.scss'
export const Success = () => {

  const paymentStatus = JSON.parse(
    sessionStorage.getItem("paymentStatus") as string
  );

  // Now you can use the paymentStatus object normally
  console.log(paymentStatus);
const handler = () =>{
  sessionStorage.clear();
  window.location.href = "/";
}
  return (
    <main>
    <div className="container px-0">
       <div className="signup-content d-flex">
        <section className="signup-img">
            <img src="assets/img/form-img.jpg" alt=""/>
            <div className="signup-img-content">
              <a href="#" className="c4c-logo">
                  <img src="assets/img/cloud4c_logo.png"/>
              </a>
          </div>
        </section>
        <section className="mbllogobg">
            <a href="#" className="c4c-logo">
                <img src="assets/img/cloud4c_logo.png"/>
            </a>
        </section>
        <section className="signup-form pb-3">
          <header className="d-flex justify-content-between">
            <h4>Payments</h4>
          
          </header>
            <div className="paymentinfo p-5 h-70">
                 
              <div className="paywrapper green">
                <div className="card__wrapper">
                
                  <div className="card__body">
                    <div className="sign"><span></span></div>
                  </div>
                </div>
                <h1 className="pt-3">Payment Success!</h1>
                <div className="text-muted fw-bold my-2">Transaction Number: { paymentStatus && paymentStatus.TXNID}</div>
                <hr className='border-dashed'/>
                {/* <div className="ticketRip">
                  <div className="ripLine"></div>
                </div> */}
                  <div className="row mt-3">
                      <div className="col-md-6">
                        <label className="form-label d-block mb-1 text-black-50 fw-medium">Amount Paid</label>
                        <label className="form-label mb-1 d-block  fw-medium">{paymentStatus && paymentStatus.TXNAMOUNT}</label>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label mb-1 d-block text-black-50 fw-medium">Bank Transaction Number</label>
                        <label className="form-label mb-1 d-block  fw-medium">  {paymentStatus && paymentStatus.BANKTXNID}</label>
                      </div>
                  </div>
                <button onClick={handler}>Back</button>
              </div>

            </div>
        </section>
       </div>
    </div>
 </main>
  )
}
