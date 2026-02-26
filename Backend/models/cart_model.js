import { pool } from "../Server.js"

export const addtoCart = async (userId, productId, quantity) => {
    const result = await pool.query(`
    INSERT INTO cart (user_id,product_id,quantity)
    VALUES ($1,$2,$3)
    RETURNING *;
    `, [userId, productId, quantity])
    return result.rows[0];
}

export const getCart = async (userId) => {
    const result = await pool.query(`
        SELECT
            p.id,
            p.name,
            p.brand,
            p.price,
            p.currency,
            p.type,
            p.category,
            c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
    `, [userId]);
    return result.rows;
}

export const removeFromCart = async (userId, productId) => {
    const result = await pool.query(
        `DELETE FROM cart WHERE user_id=$1 AND product_id=$2 RETURNING *;`,
        [userId, productId]
    );
    return result.rows[0];
}

export const updateCartQuantity = async (userId, productId, quantity) => {
    const result = await pool.query(
        `UPDATE cart SET quantity=$3 WHERE user_id=$1 AND product_id=$2 RETURNING *;`,
        [userId, productId, quantity]
    );
    return result.rows[0];
}

export const clearCart = async (userId) => {
    const result = await pool.query(
        `DELETE FROM cart WHERE user_id=$1 RETURNING *;`,
        [userId]
    );
    return result.rows;
}