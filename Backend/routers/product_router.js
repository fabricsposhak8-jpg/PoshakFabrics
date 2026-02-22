import express from "express";
import { createProductController, getAllProductsController, deleteProductController, updateProductController } from "../controllers/product_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
const router = express.Router();

router.post("/add", authMiddleware, admin_Middleware, createProductController);
router.get("/", authMiddleware, admin_Middleware, getAllProductsController);
router.delete("/:id", authMiddleware, admin_Middleware, deleteProductController);
router.put("/:id", authMiddleware, admin_Middleware, updateProductController);


// User Routes
router.get("/user", getAllProductsController);

export default router;