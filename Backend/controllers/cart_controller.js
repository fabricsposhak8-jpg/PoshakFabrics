import { addtoCart, getCart, removeFromCart, updateCartQuantity, clearCart } from "../models/cart_model.js";
import redis from "../middlewares/Redis.js";
export const AddToCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const result = await addtoCart(userId, productId, quantity);
        await redis.del("cart");
        await redis.set("cart", result);
        return res.status(200).json({ message: "Added to cart", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const GetCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cachedCart = await redis.get("cart");
        if (cachedCart) {
            return res.status(200).json({ message: "Cart", result: cachedCart });
        }
        const result = await getCart(userId);
        await redis.set("cart", result);
        return res.status(200).json({ message: "Cart", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const RemoveFromCartMiddleware = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        await redis.del(`cart:${userId}`);
        const result = await removeFromCart(userId, productId);
        return res.status(200).json({ message: "Removed from cart", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateQuantityMiddleware = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        await redis.del(`cart:${userId}`);
        const result = await updateCartQuantity(userId, productId, quantity);
        await redis.set(`cart:${userId}`, result);
        return res.status(200).json({ message: "Quantity updated", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const ClearCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await redis.del(`cart:${userId}`);
        const result = await clearCart(userId);
        return res.status(200).json({ message: "Cart cleared", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}