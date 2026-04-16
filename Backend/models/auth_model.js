import { pool } from "../Server.js"
import bcrypt from "bcrypt"

export const createUser = async (username, email, password, role = "user") => {
    const hashedpassword = await bcrypt.hash(password, 10);
    const querry = `
    INSERT INTO users (username,email,password,role)
    VALUES ($1,$2,$3,$4)
    RETURNING id,username,email,role
    `;

    const values = [username, email, hashedpassword, role];
    const result = await pool.query(querry, values);
    return result.rows[0];
}
export const getUserByEmail = async (email) => {
    const querry = `SELECT  * FROM users WHERE email=$1`;
    const result = await pool.query(querry, [email]);
    return result.rows[0];
}
export const getAllUsers = async () => {
    const querry = `SELECT id, username, email, role, created_at FROM users where role='user' ORDER BY created_at DESC`;
    const result = await pool.query(querry);
    return result.rows;
}

export const GetUsers = async () => {
    const querry = `SELECT id, username, email, role, password,created_at FROM users where role='user' ORDER BY created_at DESC`;
    const result = await pool.query(querry);
    return result.rows;
} 