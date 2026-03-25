import { pool } from "../Server.js"
import cloudinary from "../config/cloudinary.js"

export const AddOrder = async (user_id, product_id, payment_method, total_price, shipping_price, file) => {
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
    INSERT INTO orders (user_id, product_id, payment_method, total_price, shipping_price, payment_receipt)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

        const values = [user_id, product_id, payment_method, total_price, shipping_price, JSON.stringify(receiptdata)];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}

export const GetOrder = async (user_id) => {
    try {
        const query = `
        SELECT * FROM orders WHERE user_id = $1;
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
        SELECT * FROM orders;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log(error)
    }
}
