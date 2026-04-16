import { AddOrder, GetOrder, AdminGetOrder, AdminGetSpecificOrder, DeleteSpecificOrder, SpecificUserOrder, UpdateStatus } from "../models/order_model.js";
import redis from "../middlewares/Redis.js";
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

        const cachedOrder = await redis.get(`order:${user_id}`);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from cache", order: JSON.parse(cachedOrder) });
        }

        const order = await GetOrder(user_id);
        await redis.set(`order:${user_id}`, JSON.stringify(order));
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetOrder = async (req, res) => {
    try {

        const cachedOrder = await redis.get(`order`);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: JSON.parse(cachedOrder) });
        }

        const order = await AdminGetOrder();
        await redis.set(`order`, JSON.stringify(order));
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetSpecificOrder = async (req, res) => {
    try {

        const cachedOrder = await redis.get(`order:${req.params.id}`);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: JSON.parse(cachedOrder) });
        }

        const order = await AdminGetSpecificOrder(req.params.id);
        await redis.set(`order:${req.params.id}`, JSON.stringify(order));
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const deleteSpecificOrder = async (req, res) => {
    try {

        const order = await DeleteSpecificOrder(req.params.id);
        await redis.del(`order:${req.params.id}`);
        res.status(200).json({ msg: "Order deleted successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}


export const specificUserOrder = async (req, res) => {
    try {

        const cachedOrder = await redis.get(`order:${req.params.id}`);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: JSON.parse(cachedOrder) });
        }

        const order = await SpecificUserOrder(req.params.id);
        await redis.set(`order:${req.params.id}`, JSON.stringify(order));
        res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const AdminUpdateStatus = async (req, res) => {
    try {
        const { id, order_status, payment_status, is_delivered } = req.body;

        const order = await UpdateStatus(id, order_status, payment_status, is_delivered);
        await redis.del(`order:${id}`);
        await redis.set(`order:${id}`, JSON.stringify(order));
        res.status(200).json({ msg: "Order updated successfully", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}
