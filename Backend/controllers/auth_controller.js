import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getAllUsers, GetUsers } from "../models/auth_model.js";
import redis from "../middlewares/Redis.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const user = await createUser(username, email, password);
        await redis.del("Allusers");
        const Allusers = await GetUsers();
        await redis.set("Allusers", Allusers);
        return res.status(200).json({ msg: "User created", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const cachedUser = await redis.get(`Allusers:${email}`);
        if (cachedUser) {
            const user = cachedUser; // Upstash auto-deserializes, no JSON.parse needed
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            return res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        }
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const AdminGetAllUsers = async (req, res) => {
    try {
        const cachedUsers = await redis.get("users");
        if (cachedUsers) {
            return res.status(200).json({ msg: "Users fetched successfully", users: cachedUsers });
        }
        const users = await getAllUsers();
        await redis.set("users", users); // Upstash handles serialization
        res.status(200).json({ msg: "Users fetched successfully", users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


export const GetAllUsers = async (req, res) => {
    try {
        const cachedUsers = await redis.get("Allusers");
        if (cachedUsers) {
            return res.status(200).json({ msg: "Users fetched successfully", users: cachedUsers });
        }
        const users = await GetUsers();
        await redis.set("Allusers", users);
        res.status(200).json({ msg: "Users fetched successfully", users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
}
