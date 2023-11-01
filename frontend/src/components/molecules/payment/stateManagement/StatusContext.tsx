// StatusContext.js
import React, { createContext, useContext, useState } from "react";

const StatusContext = createContext<any>(null);

export const usePaymentStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }: any) => {
  const [orderDetails, setOrderDetails] = useState({});

  return (
    <StatusContext.Provider
      value={{
        orderDetails,
        setOrderDetails,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};
