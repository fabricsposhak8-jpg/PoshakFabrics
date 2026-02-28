import { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../models/product_model.js";

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
        const products = await getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const product = await deleteProduct(req.params.id);
        return res.status(200).send("Product deleted successfully");
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
        const product = await getProductById(req.params.id);
        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}
