// withUserContext.tsx
import React from "react";
import PaymentContext from "./PaymentContext";

const WithPaymentContext = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const user = PaymentContext;
    return <WrappedComponent {...props} user={user} />;
  };
};

export default WithPaymentContext;
