import { Router } from 'express';
import { createMessage } from "../services/message.service.js";
import { create } from 'domain';
import { getMessagesByRoom } from '../services/message.service.js';

export const messageRouter = Router();

messageRouter.post("/", async (req, res) => {
    console.log("[API] POST /messages bpdy:", req.body)
    try {
        const message = await createMessage(req.body);
        res.status(201).json(message);
    } catch (err) {
        console.error("[API] createMessage failed:", err);
        res.status(500).json({ error: "Internal error" });
    }
})

messageRouter.get("/", async (req, res) => {
    const { roomId } = req.query;
    if (!roomId) return res.sendStatus(400);

    const messages = await getMessagesByRoom(roomId as string);
    res.json(messages);
})