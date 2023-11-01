import { Router } from "express";
import { getPaymentForm, submitPaymentForm, updatePaymentForm } from "../contollers/paymentForm.controller";
const router: Router = Router();

router.post("/submit", submitPaymentForm)
router.post("/update", updatePaymentForm)
router.post("/fetch/:id", getPaymentForm)
export default router;