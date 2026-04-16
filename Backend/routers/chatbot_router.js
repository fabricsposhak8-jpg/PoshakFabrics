import express from "express";
const router = express.Router();
import { chatbotController } from "../controllers/Chatbot_Controller.js";

router.post("/chat", chatbotController);

export default router;