import { Router } from "express";
import { initiateTransaction, updatePaymentStatus } from "../contollers/paymentContoller";
//import { techProcessCallBack } from "../contollers/techProcess.controller";
import { parseRequestBody } from "../middlewares/parseRequest";
const router: Router = Router();

router.post("/create",parseRequestBody,initiateTransaction)
//router.post('/paytmCallBack',getPaymentStatus)
router.post('/updatePaymentStatus',parseRequestBody, updatePaymentStatus)
//router.post("/techProcessCallBack", techProcessCallBack)
export default router;