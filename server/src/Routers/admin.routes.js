import { Router } from "express";
import { verifyJWT } from '../MiddleWare/Auth.middleWare.js'
import { requireRole } from "../MiddleWare/Role.middleware.js";

import {
  getAdminDashboard,
  getAllUsers,
  getAllCrops,
  deleteCropByAdmin,
  getAllFarmersForAdmin,
  toggleBlockUser,
  verifyFarmer
} from "../Controllers/Admin.controller.js";

const router = Router();

//  All Admin routes protected
router.get("/dashboard", verifyJWT, requireRole("admin"), getAdminDashboard);

router.get("/farmers", verifyJWT, requireRole("admin"), getAllFarmersForAdmin);
//  Farmer verification
router.put("/farmers/:id/verify", verifyJWT, requireRole("admin"), verifyFarmer);

router.get("/crops", verifyJWT, requireRole("admin"), getAllCrops);
router.delete("/crops/:id", verifyJWT, requireRole("admin"), deleteCropByAdmin);


router.get("/users", verifyJWT, requireRole("admin"), getAllUsers);
router.put("/users/:id/block", verifyJWT, requireRole("admin"), toggleBlockUser);



export default router;
