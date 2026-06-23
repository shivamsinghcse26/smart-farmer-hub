import { Router } from "express";
import { verifyJWT } from "../MiddleWare/Auth.middleWare.js";
import { createPaymentOrder, verifyPayment } from "../Controllers/payment.controller.js";

const router = Router();

router.post("/create-order", verifyJWT, createPaymentOrder);
router.post("/verify", verifyJWT, verifyPayment);

export default router;
