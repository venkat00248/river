import { Router } from "express";
import {reCaptchaVerification } from "../contollers/captchaController";
const router: Router = Router();

router.post('/verifyCaptchaResponse', reCaptchaVerification)
export default router;