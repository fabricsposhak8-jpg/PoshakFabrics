import { createOrder, getOrder, adminGetOrder, adminGetSpecificOrder, deleteSpecificOrder, specificUserOrder, AdminUpdateStatus } from "../controllers/Order_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
import express from "express";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/add/:id", authMiddleware, upload.single("payment_receipt"), createOrder);
router.get("/get", authMiddleware, getOrder);
router.get("/admin/get", authMiddleware, admin_Middleware, adminGetOrder);
router.get("/admin/get/:id", authMiddleware, admin_Middleware, adminGetSpecificOrder);
router.delete("/delete/:id", authMiddleware, deleteSpecificOrder);
router.get("/user/get/:id", authMiddleware, specificUserOrder);
router.put("/update", authMiddleware, admin_Middleware, AdminUpdateStatus);

export default router;