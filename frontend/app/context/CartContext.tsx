"use client";

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

export default function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from API on mount
    useEffect(() => {
        const fetchCart = async () => {
            const token = getToken();
            if (!token) return;
            try {
                const res = await fetch(`${API}/api/cart/getcart`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    console.error("Failed to fetch cart. Status:", res.status);
                    return;
                }

                const response = await res.json();
                // ✅ Use fallback to empty array to prevents crash if .result is missing
                setCart(Array.isArray(response.result) ? response.result : []);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        };
        fetchCart();
    }, [API]);

    const addToCart = async (item: Omit<CartItem, "quantity">) => {
        try {
            const token = getToken();
            const res = await fetch(`${API}/api/cart/addtocart`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId: item.id, quantity: 1 })
            });
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
            const token = getToken();
            const res = await fetch(`${API}/api/cart/removefromcart`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId: id })
            });
            const data = await res.json();
            if (data.status === 200) {
                setCart((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            const token = getToken();
            const res = await fetch(`${API}/api/cart/updatequantity`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId: id, quantity })
            });
            setCart((prev) =>
                prev.map((p) => (p.id === id ? { ...p, quantity } : p))
            );
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${API}/api/cart/clearcart`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setCart([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    // ✅ Use optional chaining + fallback to handle undefined/null cart
    const totalItems = (cart || []).reduce((sum, p) => sum + (p?.quantity || 0), 0);
    const totalPrice = (cart || []).reduce((sum, p) => sum + (p?.price || 0) * (p?.quantity || 0), 0);

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
