import { pool } from "../Server.js";


export const getSale = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id AS sale_id,
                s.headline,
                s.sale_discount_percentage,
                s.start_date,
                s.end_date,
                s.is_active,
                p.id AS product_id,
                p.name,
                p.price,
                p.images,
                p.description,
                p.type_gender,
                sp.original_price,
                sp.discounted_price
            FROM sale s
            LEFT JOIN sale_products sp ON s.id = sp.sale_id
            LEFT JOIN products p ON sp.product_id = p.id
            ORDER BY s.id DESC
        `);
        return result.rows;

    } catch (error) {
        console.log(error);
        throw error;
    }
};




export const AddProductOnSaleModel = async (data) => {
    try {
        const { sale_id, product_ids, headline, sale_discount_percentage, start_date, end_date } = data;

        let SalesId = sale_id;
        let discount = sale_discount_percentage ? Number(sale_discount_percentage) : null;

        if (!SalesId) {
            const createSale = await pool.query(
                `INSERT INTO sale (headline, sale_discount_percentage, start_date, end_date)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [
                    headline || null,
                    discount,
                    start_date || null,
                    end_date || null
                ]
            );
            SalesId = createSale.rows[0].id;
        } else {
            if (discount === null) {
                const saleData = await pool.query(`SELECT sale_discount_percentage FROM sale WHERE id = $1`, [SalesId]);
                if (saleData.rows.length > 0) {
                    discount = saleData.rows[0].sale_discount_percentage;
                }
            }
        }

        if (!product_ids || product_ids.length === 0) {
            return { msg: "Sale created without products", sale_id: SalesId };
        }

        const product = await pool.query(`SELECT id, price FROM products WHERE id = ANY($1::int[])`,
            [product_ids]
        );

        if (product.rows.length === 0) {
            throw new Error("No valid products found");
        }

        const values = [];
        const placeholders = [];

        product.rows.forEach((item, index) => {
            const discounted = discount ?
                item.price - (item.price * discount / 100) :
                item.price;
            const base = index * 4;

            placeholders.push(
                `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`
            );
            values.push(
                SalesId,
                item.id,
                item.price,
                discounted
            );
        });

        await pool.query(
            `INSERT INTO sale_products 
            (sale_id, product_id, original_price, discounted_price)
            VALUES ${placeholders.join(", ")}`,
            values
        );

        return {
            msg: "Sale updated successfully with products",
            sale_id: SalesId
        };

    } catch (error) {
        console.log("Error in AddProductOnSaleModel:", error);
        throw error; // Let the controller handle the response
    }
}



export const UpdateSaleModel = async (data) => {
    try {
        const {
            sale_id,
            headline,
            sale_discount_percentage,
            start_date,
            end_date,
            is_active
        } = data;

        const result = await pool.query(
            `UPDATE sale 
             SET 
                headline = COALESCE($1, headline),
                sale_discount_percentage = COALESCE($2, sale_discount_percentage),
                start_date = COALESCE($3, start_date),
                end_date = COALESCE($4, end_date),
                is_active = COALESCE($5, is_active)
             WHERE id = $6
             RETURNING *`,
            [
                headline || null,
                sale_discount_percentage ? Number(sale_discount_percentage) : null,
                start_date || null,
                end_date || null,
                is_active,
                sale_id
            ]
        );

        return {
            msg: "Sale updated successfully",
            response: result.rows[0]
        };

    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const RemoveSingleProductModel = async (sale_id, product_id) => {
    try {
        await pool.query(
            `DELETE FROM sale_products WHERE sale_id = $1 AND product_id = $2`,
            [sale_id, product_id]
        );

        return {
            msg: "Product removed from sale successfully"
        };

    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const RemoveEntireSaleModel = async (sale_id) => {
    try {
        await pool.query(`DELETE FROM sale WHERE id = $1`, [sale_id]);

        return {
            msg: "Entire sale deleted successfully"
        };

    } catch (error) {
        console.log(error);
        throw error;
    }
};