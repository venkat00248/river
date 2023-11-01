// UserContext.tsx
import { createContext, useContext } from "react";


const PaymentContext = createContext<any>(null);

export const usePaymentContext = () => {
  return useContext(PaymentContext);
};

export default PaymentContext;
