import { pool } from "../Server.js";

export const createMessage = async (messageData) => {
    const result = await pool.query(
        "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
        [messageData.name, messageData.email, messageData.message]
    );
    return result.rows[0];
};

export const getMessages = async () => {
    const result = await pool.query("SELECT * FROM messages");
    return result.rows;
};

export const deleteMessage = async (id) => {
    const result = await pool.query("DELETE FROM messages WHERE id = $1", [id]);
    return result.rows[0];
};