import express from "express";
import { createMessageController, getMessagesController, deleteMessageController } from "../controllers/message_controller.js";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";

router.post("/add", createMessageController);
router.get("/", authMiddleware, admin_Middleware, getMessagesController);
router.delete("/:id", authMiddleware, admin_Middleware, deleteMessageController);

export default router;