import express from "express";
import connectDB from "./DB/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import  dns  from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);


dotenv.config();

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://kishan-setu-8yif.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);






import userRouter from "./Routers/User.routes.js";
import farmerRouter from "./Routers/farmer.routes.js";
import cropRouter from "./Routers/crop.routes.js";
import BuyerRouter from "./Routers/Buyer.routes.js";
import OrderRouter from "./Routers/order.routes.js";
import authRouter from "./Routers/auth.routes.js";
import adminRoutes from "./Routers/admin.routes.js";
import orderRoutes from "./Routers/order.routes.js";
import transactionRoutes from "./Routers/transaction.routes.js";
import paymentRoutes from "./Routers/payment.routes.js";
import chatRoutes from "./Routers/chat.routes.js";
import schemeRoutes from "./Routers/scheme.routes.js";


app.use("/api/v1", chatRoutes);


app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/payments", paymentRoutes);


app.use("/api/v1/users", userRouter);
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/crops", cropRouter);
app.use("/api/v1/buyers",BuyerRouter);
app.use("/api/v1/order",OrderRouter)

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/schemes", schemeRoutes);


//global error middleware that are help to send clear and concise error message to frontend
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
 

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });
