import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact/send
router.post("/send", contactController.sendContact);

export default router;
