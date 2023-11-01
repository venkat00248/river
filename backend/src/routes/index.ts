import { Router } from "express";
import paymentRouter from "./paymentRouters"
import captchaRouter from './captchaRouters'
import paymentFormRouters from "./paymentForm"
const router: Router = Router();
router.use('/payment',paymentRouter)
router.use('/captcha', captchaRouter)
router.use('/paymentForm', paymentFormRouters)

export default router;