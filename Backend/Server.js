import "./config/env.js";
import express from "express";
import cors from "cors";
import { Pool } from "pg";

import authRoutes from "./routers/auth_router.js";
import productRoutes from "./routers/product_router.js";
import messageRoutes from "./routers/message_router.js";
import cartRoutes from "./routers/cart_router.js";
import orderRoutes from "./routers/Order_router.js";


const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://www.poshakfabrics.org"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow server-to-server or Postman
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    idleTimeoutMillis: 10000,
    max: 5,
});

pool.on("error", (err) => {
    console.error("⚠️ Pool error (connection dropped by Neon):", err.message);
});

pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL (Neon)");
        client.release();
    })
    .catch(err => console.error("❌ DB Connection Error:", err.message));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.get("/", (req, res) => res.send("POSHAK FABRICS Backend running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));