import { pool } from "../Server.js"
import cloudinary from "../config/cloudinary.js"

export const createProduct = async (productData = {}, files) => {
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
        type,
        after_discou,
        discount_perc,
        type_gender

    } = productData;

    let parsedFabricDetails = fabric_details;
    if (typeof fabric_details === "string") {
        try {
            parsedFabricDetails = JSON.parse(fabric_details);
        } catch (error) {
            parsedFabricDetails = fabric_details;
        }
    }

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
        INSERT INTO products (name,brand,category,description,price,currency,fabric_details,stock,status,type,images,after_discou,discount_perc,type_gender)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) 
        RETURNING *;
        `, [name, brand, category, description, price, currency, JSON.stringify(parsedFabricDetails), stock, status, type, JSON.stringify(images), after_discou, discount_perc, type_gender])

    return result.rows[0];
}


export const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM products')
    return result.rows;
}

export const deleteProduct = async (id) => {
    const product = await pool.query('SELECT images FROM products WHERE id=$1', [id])

    if (product.rows.length === 0) {
        return null; // Product already deleted or doesn't exist
    }

    const images = product.rows[0].images;
    if (images) {
        for (const img of images) {
            if (img.cloudinary_id) {
                await cloudinary.uploader.destroy(img.cloudinary_id);
            }
        }
    }

    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id])

    return result.rows[0];
}

export const updateProduct = async (id, productData = {}, files) => {

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




    let parsedFabricDetails = productData.fabric_details;
    if (typeof productData.fabric_details === "string") {
        try {
            parsedFabricDetails = JSON.parse(productData.fabric_details);
        } catch (error) {
            parsedFabricDetails = productData.fabric_details;
        }
    }

    const result = await pool.query('UPDATE products SET name=COALESCE($1,name),brand=COALESCE($2,brand),category=COALESCE($3,category),description=COALESCE($4,description),price=COALESCE($5,price),currency=COALESCE($6,currency),fabric_details=COALESCE($7,fabric_details),stock=COALESCE($8,stock),status=COALESCE($9,status),type=COALESCE($10,type),images = COALESCE($11, images), after_discou=COALESCE($12,after_discou),discount_perc=COALESCE($13,discount_perc),type_gender=COALESCE($14,type_gender) WHERE id=$15 RETURNING *', [
        productData.name || null,
        productData.brand || null,
        productData.category || null,
        productData.description || null,
        productData.price || null,
        productData.currency || null,
        JSON.stringify(parsedFabricDetails),
        productData.stock || null,
        productData.status || null,
        productData.type || null,
        JSON.stringify(images),
        productData.after_discou || null,
        productData.discount_perc || null,
        productData.type_gender || null,
        id
    ])
    return result.rows[0];
}


export const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id=$1', [id])
    return result.rows[0];
}
