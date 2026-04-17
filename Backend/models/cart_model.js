import { pool } from "../Server.js"

export const addtoCart = async (userId, productId, quantity) => {
    // Check if the item already exists in the cart for this user
    const checkResult = await pool.query(
        `SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2`,
        [userId, productId]
    );

    if (checkResult.rows.length > 0) {
        // Item exists, update its quantity
        const updatedQuantity = checkResult.rows[0].quantity + quantity;
        const result = await pool.query(
            `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
            [updatedQuantity, userId, productId]
        );
        return result.rows[0];
    } else {
        // Item doesn't exist, insert new row
        const result = await pool.query(
            `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
            [userId, productId, quantity]
        );
        return result.rows[0];
    }
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
            SUM(c.quantity) as quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
        GROUP BY 
            p.id, p.name, p.brand, p.price, p.currency, p.type, p.category
    `, [userId]);

    // Ensure quantity is returned as a number
    return result.rows.map(item => ({
        ...item,
        quantity: parseInt(item.quantity, 10)
    }));
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