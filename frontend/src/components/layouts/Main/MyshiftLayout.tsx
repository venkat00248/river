import "./MyShiftLayout.scss";
import { Review } from "../../molecules/payment/Review";
import { Payment } from "../../molecules/payment/PaymentController";
import { Success } from "../../molecules/payment/Success";
import { Failure } from "../../molecules/payment/Failure";
import { useRoutes } from "react-router";
import { routes } from "../../auth/routes/routes";

export const MyshiftLayout = () => {
  const routeResult: any = useRoutes(routes);

  return (
    <div className={`myShiftLayout`}>
      {/* <Payment/> */}

      {routeResult}
      {/* <Success/> */}
      {/* <Failure/> */}
      </div>
  );
};
