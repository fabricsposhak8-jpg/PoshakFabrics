import { AddOrder, GetOrder, AdminGetOrder, AdminGetSpecificOrder, DeleteSpecificOrder, SpecificUserOrder, UpdateStatus } from "../models/order_model.js";
import { getUserById } from "../models/auth_model.js";
import redis from "../middlewares/Redis.js";
import nodemailer from "nodemailer";

//
const getCachedData = async (key) => {
    try {
        const cached = await redis.get(key);
        return cached; // Upstash automatically parses JSON
    } catch (error) {
        console.warn(`[Redis] Error retrieving key "${key}" — clearing it.`, error);
        await redis.del(key);
        return null;
    }
};

export const createOrder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product_id = req.params.id;
        const shipping_price = 250;
        const { payment_method, total_price, quantity, country, city, postal_code, address_line } = req.body;
        const payment_receipt = req.file;
        const order = await AddOrder(user_id, product_id, payment_method, total_price, shipping_price, payment_receipt, quantity, country, city, postal_code, address_line);

        if (order) {
            // Setup Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS
                }
            });

            // Fetch user email
            const user = await getUserById(user_id);

            if (user && user.email) {
                const mailOptions = {
                    from: process.env.USER_EMAIL,
                    to: user.email,
                    subject: 'Order Confirmation - Poshak Fabrics',
                    html: `
                    <h2>Thank you for your order!</h2>
                    <p>Dear ${user.username || 'Customer'},</p>
                    <p>Your order has been successfully placed. Here are your order details:</p>
                    <ul>
                        <li><strong>Order ID:</strong> ${order.id || 'N/A'}</li>
                        <li><strong>Total Price:</strong> Rs. ${total_price}</li>
                        <li><strong>Payment Method:</strong> ${payment_method}</li>
                        <li><strong>Shipping Address:</strong> ${address_line}, ${city}, ${country}</li>
                    </ul>
                    <p>We are processing your order and will notify you once it has been shipped.</p>
                    <br/>
                    <p>Best Regards,</p>
                    <p><strong>Poshak Fabrics Team</strong></p>
                `
                };

                // Send email asynchronously
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email: ", error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }

            return res.status(200).json({ success: true, msg: "Order created successfully", order });
        } else {
            return res.status(400).json({ success: false, msg: "Failed to create order. Please try again." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
}

export const getOrder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const key = `order:${user_id}`;

        const cachedOrder = await getCachedData(key);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from cache", order: cachedOrder });
        }

        const order = await GetOrder(user_id);
        await redis.set(key, order);
        return res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetOrder = async (req, res) => {
    try {
        const key = `order`;

        const cachedOrder = await getCachedData(key);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: cachedOrder });
        }

        const order = await AdminGetOrder();
        await redis.set(key, order);
        return res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const adminGetSpecificOrder = async (req, res) => {
    try {
        const key = `order:${req.params.id}`;

        const cachedOrder = await getCachedData(key);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: cachedOrder });
        }

        const order = await AdminGetSpecificOrder(req.params.id);
        await redis.set(key, order);
        return res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const deleteSpecificOrder = async (req, res) => {
    try {
        const order = await DeleteSpecificOrder(req.params.id);
        await redis.del(`order:${req.params.id}`);
        return res.status(200).json({ msg: "Order deleted successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const specificUserOrder = async (req, res) => {
    try {
        const key = `order:${req.params.id}`;

        const cachedOrder = await getCachedData(key);
        if (cachedOrder) {
            return res.status(200).json({ msg: "Order fetched successfully from Cache", order: cachedOrder });
        }

        const order = await SpecificUserOrder(req.params.id);
        await redis.set(key, order);
        return res.status(200).json({ msg: "Order fetched successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const AdminUpdateStatus = async (req, res) => {
    try {
        const { id, order_status, payment_status, is_delivered } = req.body;

        const order = await UpdateStatus(id, order_status, payment_status, is_delivered);
        await redis.del(`order:${id}`);
        await redis.set(`order:${id}`, order);
        return res.status(200).json({ msg: "Order updated successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}
