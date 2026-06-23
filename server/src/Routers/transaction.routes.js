import { Router } from "express";
import { verifyJWT } from "../MiddleWare/Auth.middleWare.js";
import { getFarmerTransactions, getBuyerTransactions } from "../Controllers/Transacation.controller.js";

const router = Router();

router.get("/farmer", verifyJWT, getFarmerTransactions);
router.get("/buyer", verifyJWT, getBuyerTransactions);

export default router;
