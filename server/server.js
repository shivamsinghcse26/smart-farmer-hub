
import express from "express";
import connectDB from "./src/DB/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from 'helmet'
import  dns  from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);


dotenv.config();

const app = express();
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));

  app.use(
  cors({
    origin: [
      "https://kishan-setu-8yif.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());



//auth and admin route
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/schemes", schemeRoutes);

//farmer route
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/crops", cropRouter);







//glodal route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});


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

  