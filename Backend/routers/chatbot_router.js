import express from "express";
const router = express.Router();
import { chatbotController, ModifyDescription } from "../controllers/Chatbot_Controller.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
router.post("/chat", chatbotController);
router.post("/modify-description", authMiddleware, admin_Middleware, ModifyDescription)

export default router;