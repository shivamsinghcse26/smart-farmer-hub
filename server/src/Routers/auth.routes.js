import { Router } from "express";
import { verifyJWT , refreshAccessToken} from '../MiddleWare/Auth.middleWare.js'
import { getCurrentUser,forgotPassword, resetPassword } from "../Controllers/Auth.controller.js";

const router = Router();

// ✅ This route checks login session
router.get("/me", verifyJWT, getCurrentUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/refresh-token", refreshAccessToken);
export default router;
