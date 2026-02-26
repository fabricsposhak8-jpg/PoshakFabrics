"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: number;
    name: string;
    brand: string;
    price: number;
    currency: string;
    type: string;
    category: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

const getToken = () => localStorage.getItem("token");
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export default function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    console.log("Cart", cart);
    // Load cart from API on mount
    useEffect(() => {
        const fetchCart = async () => {
            const token = getToken();
            if (!token) return;
            try {
                const response = await axios.get(
                    `${API}/api/cart/getcart`,
                    authHeader()
                );

                setCart(response.data.result);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        };
        fetchCart();
    }, []);

    const addToCart = async (item: Omit<CartItem, "quantity">) => {
        try {
            await axios.post(
                `${API}/api/cart/addtocart`,
                { productId: item.id, quantity: 1 },
                authHeader()
            );
            setCart((prev) => {
                const existing = prev.find((p) => p.id === item.id);
                if (existing) {
                    return prev.map((p) =>
                        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                    );
                }
                return [...prev, { ...item, quantity: 1 }];
            });
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const removeFromCart = async (id: number) => {
        try {
            await axios.delete(
                `${API}/api/cart/removefromcart`,
                { ...authHeader(), data: { productId: id } }
            );
            setCart((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            await axios.put(
                `${API}/api/cart/updatequantity`,
                { productId: id, quantity },
                authHeader()
            );
            setCart((prev) =>
                prev.map((p) => (p.id === id ? { ...p, quantity } : p))
            );
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(
                `${API}/api/cart/clearcart`,
                authHeader()
            );
            setCart([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
