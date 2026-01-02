import { Router } from 'express';
import { createMessage } from "../services/message.service.js";
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
