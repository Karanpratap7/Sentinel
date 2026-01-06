import { Router } from 'express';
import { createMessage, editMessage, redactMessage } from "../services/message.service.js";
import { getMessagesByRoom } from '../services/message.service.js';
export const messageRouter = Router();
messageRouter.post("/", async (req, res) => {
    console.log("[API] POST /messages bpdy:", req.body);
    try {
        const message = await createMessage(req.body);
        res.status(201).json(message);
    }
    catch (err) {
        console.error("[API] createMessage failed:", err);
        res.status(500).json({ error: "Internal error" });
    }
});
messageRouter.get("/", async (req, res) => {
    const roomId = req.query.roomId;
    if (!roomId) {
        return res.status(400).json({ error: "roomId is required" });
    }
    try {
        const messages = await getMessagesByRoom(roomId);
        res.json(messages);
    }
    catch (err) {
        console.error("[API] getMessagesByRoom failed:", err);
        res.status(500).json({ error: "Internal error" });
    }
});
messageRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "content is required" });
    }
    try {
        const message = await editMessage(id, content);
        res.json(message);
    }
    catch (err) {
        console.error("[API] editMessage failed: ", err);
        res.status(500).json({ error: "Internal Error" });
    }
});
messageRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const message = await redactMessage(id);
        res.json(message);
    }
    catch (err) {
        console.error("[API] redactMessage failed: ", err);
        res.status(500).json({ error: "Internal error" });
    }
});
