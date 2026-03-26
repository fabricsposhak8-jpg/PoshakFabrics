import { AddOrder, GetOrder, AdminGetOrder, AdminGetSpecificOrder } from "../models/order_model.js";

export const createOrder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product_id = req.params.id;
        const shipping_price = 250;
        const { payment_method, total_price, quantity, country, city, postal_code, address_line } = req.body;
        const payment_receipt = req.file;
        const order = await AddOrder(user_id, product_id, payment_method, total_price, shipping_price, payment_receipt, quantity, country, city, postal_code, address_line);
        res.status(201).json({ msg: "Order created successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const getOrder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const order = await GetOrder(user_id);
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetOrder = async (req, res) => {
    try {
        const order = await AdminGetOrder();
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetSpecificOrder = async (req, res) => {
    try {
        const order = await AdminGetSpecificOrder(req.params.id);
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

