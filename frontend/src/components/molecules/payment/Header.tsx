import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import  { useContext } from "react";
import PaymentContext from "./stateManagement/PaymentContext";

export const Header = () => {
  const { payment, setPayment } = useContext(PaymentContext);

  const handlePaymentChange = (event:any) => {
    setPayment(event.target.checked);
  };
  return (
    <header className="d-flex justify-content-between">
      <h4>Payments</h4>
      <div className="switchright">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={payment} onChange={handlePaymentChange} />
            }
            label={payment ? "Online Payment" : "Cheque/DD/Bank Receipt"}
          />
        </FormGroup>
      </div>
    </header>
  );
};
