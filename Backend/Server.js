import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";

import authRoutes from "./routers/auth_router.js";
import productRoutes from "./routers/product_router.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// PostgreSQL pool — tuned for Neon serverless (cold starts + dropped idle connections)
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,  // 30s — Neon cold starts can be slow
    idleTimeoutMillis: 10000,        // release idle connections quickly
    max: 5,                          // keep pool small for serverless
});

// Catch unexpected pool-level errors so the process doesn't crash
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
app.get("/", (req, res) => res.send("POSHAK FABRICS Backend running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));