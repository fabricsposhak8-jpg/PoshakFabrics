import express from "express";
const router = express.Router();
import { chatbotController, ModifyDescription, GenerateDescription } from "../controllers/Chatbot_Controller.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/multer.js";
router.post("/chat", chatbotController);
router.post("/generate-description", authMiddleware, admin_Middleware, upload.array("images", 5), GenerateDescription)
router.post("/modify-description", authMiddleware, admin_Middleware, ModifyDescription)
export default router;