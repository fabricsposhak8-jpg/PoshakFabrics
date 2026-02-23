import { createMessage, getMessages, deleteMessage } from "../models/message_model.js"

export const createMessageController = async (req, res) => {
    try {
        const message = await createMessage(req.body);
        return res.status(200).json(message);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const getMessagesController = async (req, res) => {
    try {
        const messages = await getMessages();
        return res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}

export const deleteMessageController = async (req, res) => {
    try {
        const message = await deleteMessage(req.params.id);
        return res.status(200).send("Message deleted successfully");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
}