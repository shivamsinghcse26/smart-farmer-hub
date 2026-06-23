import express from "express";
import { getSchemes, addScheme, deleteScheme } from "../Controllers/Scheme.controller.js";

const router = express.Router();

router.get("/", getSchemes);
router.post("/", addScheme);
router.delete("/:id", deleteScheme);

export default router;
