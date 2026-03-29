import { pool } from "../Server.js"
import cloudinary from "../config/cloudinary.js"

export const AddOrder = async (user_id, product_id, payment_method, total_price, shipping_price, file, quantity, country, city, postal_code, address_line) => {
    try {

        let receiptdata = null;
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "poshak-orders" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                stream.end(file.buffer);
            })
            receiptdata = { url: uploadResult.secure_url, cloudinary_id: uploadResult.public_id }
        }

        const query = `
    INSERT INTO orders (user_id, product_id, payment_method, total_price, shipping_price, payment_receipt,quantity ,country , city,postal_code, address_line)
    VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11)
    RETURNING *;
    `;

        const values = [user_id, product_id, payment_method, total_price, shipping_price, JSON.stringify(receiptdata), quantity, country, city, postal_code, address_line];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}

export const GetOrder = async (user_id) => {
    try {
        const query = `
      SELECT 
                orders.*,
                users.username,
                users.email,
                products.name    AS product_name,
                products.price   AS product_price,
                products.images   AS product_image
            FROM orders
            JOIN users    ON orders.user_id    = users.id
            JOIN products ON orders.product_id = products.id
            WHERE orders.user_id = $1;
        `;
        const values = [user_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log(error)
    }
}

export const AdminGetOrder = async () => {
    try {
        const query = `
       SELECT orders.*,users.username,users.email,products.name AS product_name, products.price AS product_price,products.images AS product_image
       FROM orders
       JOIN users ON orders.user_id = users.id
       JOIN products ON orders.product_id = products.id
       ORDER BY orders.created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log(error)
    }
}

export const AdminGetSpecificOrder = async (id) => {
    try {
        const query = `
       SELECT orders.*,users.username,users.email,products.name AS product_name, products.price AS product_price,products.images AS product_image
       FROM orders
       JOIN users ON orders.user_id = users.id
       JOIN products ON orders.product_id = products.id
       WHERE orders.id = $1;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}


export const DeleteSpecificOrder = async (id) => {
    try {
        const query = `
       DELETE FROM orders
       WHERE id = $1;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}


export const SpecificUserOrder = async (id) => {
    try {
        const query = `
       SELECT orders.*,users.username,users.email,products.name AS product_name, products.price AS product_price,products.images AS product_image
       FROM orders
       JOIN users ON orders.user_id = users.id
       JOIN products ON orders.product_id = products.id
       WHERE orders.id = $1;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}

export const UpdateStatus = async (id, order_status, payment_status, is_delivered) => {
    try {
        const query = `
       UPDATE orders 
       SET 
       order_status = COALESCE($2, order_status),
       payment_status = COALESCE($3, payment_status),
       is_delivered = COALESCE($4, is_delivered),
       delivered_at = CASE WHEN $4 = true THEN CURRENT_TIMESTAMP ELSE delivered_at END
       WHERE id = $1
       RETURNING *;
        `
        const values = [id, order_status || null, payment_status || null, is_delivered ?? null];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}
