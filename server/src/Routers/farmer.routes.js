import { Router } from "express";
import { setFarmerProfile,getFarmerProfile,getFarmerDashboard } from "../Controllers/Farmer.controller.js";
import { verifyJWT } from '../MiddleWare/Auth.middleWare.js'
const router = Router();

router.use(verifyJWT);

router.route("/dashboard").get(getFarmerDashboard)
router.route("/profile").post(setFarmerProfile);
router.route("/profile").get(getFarmerProfile);

export default router;
