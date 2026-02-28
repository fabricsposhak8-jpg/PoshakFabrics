import { pool } from "../Server.js"
import cloudinary from "../config/cloudinary.js"

export const createProduct = async (productData, files) => {
    const {
        name,
        brand,
        category,
        description,
        price,
        currency,
        fabric_details,
        stock,
        status,
        type
    } = productData;

    let images = [];

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
            images.push({ url: uploadResult.secure_url, cloudinary_id: uploadResult.public_id });
        }
    }

    const result = await pool.query(`
        INSERT INTO products (name,brand,category,description,price,currency,fabric_details,stock,status,type,images)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
        RETURNING *;
        `, [name, brand, category, description, price, currency, JSON.stringify(fabric_details), stock, status, type, JSON.stringify(images)])

    return result.rows[0];
}


export const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM products')
    return result.rows;
}

export const deleteProduct = async (id) => {


    const product = await pool.query('SELECT images FROM products WHERE id=$1', [id])

    const images = product.rows[0].images;
    if (images) {
        for (const img of images) {
            await cloudinary.uploader.destroy(img.cloudinary_id);
        }
    }

    const result = await pool.query('DELETE FROM products WHERE id=$1', [id])

    return result.rows[0];
}

export const updateProduct = async (id, productData, files) => {

    const checkingproduct = await pool.query('SELECT * FROM products WHERE id=$1', [id])

    let images = checkingproduct.rows[0].images || [];

    if (files && files.length > 0) {

        // Delete old images from Cloudinary
        for (const img of images) {
            await cloudinary.uploader.destroy(img.cloudinary_id);
        }

        images = [];

        // Upload new images
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
            images.push({ url: uploadResult.secure_url, cloudinary_id: uploadResult.public_id });
        }
    }




    const result = await pool.query('UPDATE products SET name=COALESCE($1,name),brand=COALESCE($2,brand),category=COALESCE($3,category),description=COALESCE($4,description),price=COALESCE($5,price),currency=COALESCE($6,currency),fabric_details=COALESCE($7,fabric_details),stock=COALESCE($8,stock),status=COALESCE($9,status),type=COALESCE($10,type),images = COALESCE($11, images) WHERE id=$12 RETURNING *', [
        productData.name,
        productData.brand,
        productData.category,
        productData.description,
        productData.price,
        productData.currency,
        JSON.stringify(productData.fabric_details),
        productData.stock,
        productData.status,
        productData.type,
        JSON.stringify(images),
        id
    ])
    return result.rows[0];
}


export const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id=$1', [id])
    return result.rows[0];
}
