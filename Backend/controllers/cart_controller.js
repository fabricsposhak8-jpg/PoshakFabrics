import { addtoCart, getCart, removeFromCart, updateCartQuantity, clearCart } from "../models/cart_model.js";
import redis from "../middlewares/Redis.js";

export const AddToCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        await addtoCart(userId, productId, quantity);   // add item to DB
        await redis.del(`cart:${userId}`);              // clear old cache
        const updatedCart = await getCart(userId);      // fetch FULL cart from DB
        await redis.set(`cart:${userId}`, updatedCart); // store full cart in cache
        return res.status(200).json({ message: "Added to cart", result: updatedCart });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const GetCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cachedCart = await redis.get(`cart:${userId}`);
        if (cachedCart) {
            return res.status(200).json({ message: "Cart", result: cachedCart });
        }
        const result = await getCart(userId);           // fetch from DB if no cache
        await redis.set(`cart:${userId}`, result);      // store in cache
        return res.status(200).json({ message: "Cart", result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const RemoveFromCartMiddleware = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        await removeFromCart(userId, productId);        // remove item from DB
        await redis.del(`cart:${userId}`);              // clear old cache
        const updatedCart = await getCart(userId);      // fetch FULL cart from DB
        await redis.set(`cart:${userId}`, updatedCart); // store full cart in cache
        return res.status(200).json({ status: 200, message: "Removed from cart", result: updatedCart });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateQuantityMiddleware = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        await updateCartQuantity(userId, productId, quantity); // update in DB
        await redis.del(`cart:${userId}`);                    // clear old cache
        const updatedCart = await getCart(userId);            // fetch FULL cart from DB
        await redis.set(`cart:${userId}`, updatedCart);       // store full cart in cache
        return res.status(200).json({ message: "Quantity updated", result: updatedCart });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const ClearCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await clearCart(userId);               // clear DB first
        await redis.del(`cart:${userId}`);     // then clear cache
        return res.status(200).json({ message: "Cart cleared", result: [] });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}