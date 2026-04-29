import express from "express";
import { GetSale, AddProductOnSale, RemoveProduct, UpdateSale, RemoveSingleProduct } from "../controllers/sales_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
const router = express.Router();

router.get("/getsale", GetSale);
router.post("/addproductonsale", authMiddleware, admin_Middleware, AddProductOnSale);
router.put("/updatesale", authMiddleware, admin_Middleware, UpdateSale);
router.delete("/removeproduct/:sale_id", authMiddleware, admin_Middleware, RemoveProduct);
router.delete("/removesingleproduct/:sale_id/:product_id", authMiddleware, admin_Middleware, RemoveSingleProduct);


export default router;