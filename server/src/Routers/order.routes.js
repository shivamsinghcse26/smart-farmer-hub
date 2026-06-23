import { Router } from "express";
import { verifyJWT } from "../MiddleWare/Auth.middleWare.js";
import {
  placeOrder,
  getMyOrdersBuyer,
  getMyOrdersFarmer,
  updateOrderStatus,
} from "../Controllers/Order.controller.js";

const router = Router();

// ✅ place order
router.post("/place", verifyJWT, placeOrder);

// ✅ buyer orders
router.get("/buyer", verifyJWT, getMyOrdersBuyer);

// ✅ farmer orders
router.get("/farmer", verifyJWT, getMyOrdersFarmer);



// ✅ farmer update order status
router.put("/:id/status", verifyJWT, updateOrderStatus);

export default router;
