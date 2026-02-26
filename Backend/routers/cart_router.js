import express from "express";
import {
    AddToCartMiddleware,
    GetCartMiddleware,
    RemoveFromCartMiddleware,
    UpdateQuantityMiddleware,
    ClearCartMiddleware,
} from "../controllers/cart_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/addtocart", authMiddleware, AddToCartMiddleware);
router.get("/getcart", authMiddleware, GetCartMiddleware);
router.delete("/removefromcart", authMiddleware, RemoveFromCartMiddleware);
router.put("/updatequantity", authMiddleware, UpdateQuantityMiddleware);
router.delete("/clearcart", authMiddleware, ClearCartMiddleware);

export default router;