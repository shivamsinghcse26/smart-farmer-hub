import express from "express";
import { chatBot } from "../Controllers/Chat.controller.js";

const router = express.Router();

router.post("/chatbot", chatBot);

export default router;
