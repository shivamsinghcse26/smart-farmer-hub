import { Router } from "express";
import { verifyJWT } from '../MiddleWare/Auth.middleWare.js'
import {
  setBuyerProfile,
  getBuyerProfile,
  getBuyerDashboard,
  getMarketplaceCrops,
  getCropDetailsForBuyer
} from "../Controllers/Buyer.controller.js";

const router = Router();

// Profile
router.post("/profile", verifyJWT, setBuyerProfile);
router.get("/profile", verifyJWT, getBuyerProfile);

// Dashboard
router.get("/dashboard", verifyJWT, getBuyerDashboard);

// Marketplace
router.get("/marketplace", verifyJWT, getMarketplaceCrops);
router.get("/marketplace/:id", verifyJWT, getCropDetailsForBuyer);

export default router;
