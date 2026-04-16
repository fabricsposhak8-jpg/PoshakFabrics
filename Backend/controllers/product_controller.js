import { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../models/product_model.js";
import redis from "../middlewares/Redis.js";
export const createProductController = async (req, res) => {
    try {
        const product = await createProduct(req.body, req.files);
        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const getAllProductsController = async (req, res) => {
    try {

        const cachedProducts = await redis.get("products");
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }
        const products = await getAllProducts();
        await redis.set("products", JSON.stringify(products), { ex: 60 * 60 * 24 });
        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const product = await deleteProduct(req.params.id);
        await redis.del(`product:${req.params.id}`);
        return res.status(200).json({ msg: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const product = await updateProduct(req.params.id, req.body, req.files);
        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}


export const getProductByIdController = async (req, res) => {
    try {

        const cachedProductbyID = await redis.get(`product:${req.params.id}`)
        if (cachedProductbyID) {
            return res.status(200).json(cachedProductbyID);
        }

        const product = await getProductById(req.params.id);
        await redis.set(`product:${req.params.id}`, JSON.stringify(product), { ex: 60 * 60 * 24 })
        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}
