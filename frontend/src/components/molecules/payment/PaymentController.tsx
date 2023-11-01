import React, { useState } from 'react'
import './Payment.scss'
import { Form } from './Form'
import PaymentContext from "./stateManagement/PaymentContext";
import { Header } from './Header';
import { Cheque } from './Cheque';
import { FormDataProvider } from './stateManagement/FormDataContext';
import { Review } from './Review';

export const Payment = () => {
    const [payment, setPayment] = useState(true);
    const [review, setReview] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState("");
  return (
    <PaymentContext.Provider value={{ payment, setPayment ,review, setReview, selectedPayment,
        setSelectedPayment}}>
        <FormDataProvider>
    <div>

<main>
    <div className="container px-0">
       <div className="signup-content d-flex">
        <section className="signup-img">
            <img src="./assets/img/form-img.jpg" alt=""/>
            <div className="signup-img-content2">
                <a href="#" className="c4c-logo">
                    <img src="./assets/img/cloud4c_logo.png"/>
                </a>
            </div>
        </section>
        <section className="mbllogobg">
            <a href="#" className="c4c-logo">
                <img src="./assets/img/cloud4c_logo.png"/>
            </a>
        </section>
        <section className="signup-form pb-3">
            {review ?
            <>
            <Header/>
          {payment ?
       
       <Form />
        : <Cheque/>}</>:<Review/>
       }
       </section>
       </div>
    </div>
 </main>
    </div>
    </FormDataProvider>
    </PaymentContext.Provider>
  )
}
