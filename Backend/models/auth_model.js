import { pool } from "../Server.js"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"

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

export const getUserById = async (id) => {
    const querry = `SELECT  * FROM users WHERE id=$1`;
    const result = await pool.query(querry, [id]);
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

export const UpdateProfile = async (id, username, email, phonenumber, address, files) => {
    let profilePicJson = null;

    if (files && files.length > 0) {
        for (const file of files) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "poshak-products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            profilePicJson = { url: uploadResult.secure_url, cloudinary_id: uploadResult.public_id };
        }
    }

    let query, values;

    if (profilePicJson) {
        query = `UPDATE users SET username=$1, email=$2, phonenumber=$3, address=$4, profilepic=$5 WHERE id=$6 RETURNING id, username, email, phonenumber, address, profilepic`;
        values = [username, email, phonenumber, address, JSON.stringify(profilePicJson), id];
    } else {
        query = `UPDATE users SET username=$1, email=$2, phonenumber=$3, address=$4 WHERE id=$5 RETURNING id, username, email, phonenumber, address, profilepic`;
        values = [username, email, phonenumber, address, id];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
}