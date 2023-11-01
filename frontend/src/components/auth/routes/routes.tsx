// import { CheckBox } from "../../molecules/CheckBox/CheckBox";
import { Failure } from "../../molecules/payment/Failure";
import { Payment } from "../../molecules/payment/PaymentController";
import { Success } from "../../molecules/payment/Success";
export const routes: any = [
  
  { path: "/", element: <Payment /> },
  { path: "success", element: <Success /> },
  { path: "failure", element: <Failure /> },
  
  // { path: "admin/workflow", element: <WorkFlow /> }
];
