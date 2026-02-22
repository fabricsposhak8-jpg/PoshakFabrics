import { pool } from "../Server.js"

export const createProduct = async (productData) => {
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

    const result = await pool.query(`
        INSERT INTO products (name,brand,category,description,price,currency,fabric_details,stock,status,type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *;
        `, [name, brand, category, description, price, currency, JSON.stringify(fabric_details), stock, status, type])

    return result.rows[0];
}


export const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM products')
    return result.rows;
}

export const deleteProduct = async (id) => {
    const result = await pool.query('DELETE FROM products WHERE id=$1', [id])
    return result.rows[0];
}

export const updateProduct = async (id, productData) => {
    const result = await pool.query('UPDATE products SET name=COALESCE($1,name),brand=COALESCE($2,brand),category=COALESCE($3,category),description=COALESCE($4,description),price=COALESCE($5,price),currency=COALESCE($6,currency),fabric_details=COALESCE($7,fabric_details),stock=COALESCE($8,stock),status=COALESCE($9,status),type=COALESCE($10,type) WHERE id=$11 RETURNING *', [
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
        id
    ])
    return result.rows[0];
}