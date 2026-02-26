import { addtoCart, getCart, removeFromCart, updateCartQuantity, clearCart } from "../models/cart_model.js";

export const AddToCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const result = await addtoCart(userId, productId, quantity);
        res.status(200).json({ message: "Added to cart", result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const GetCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await getCart(userId);
        res.status(200).json({ message: "Cart", result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const RemoveFromCartMiddleware = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        const result = await removeFromCart(userId, productId);
        res.status(200).json({ message: "Removed from cart", result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateQuantityMiddleware = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const result = await updateCartQuantity(userId, productId, quantity);
        res.status(200).json({ message: "Quantity updated", result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const ClearCartMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await clearCart(userId);
        res.status(200).json({ message: "Cart cleared", result });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}