import { z } from "zod";
import { pool } from "../db/pool.js";
import crypto from "crypto";
const MessageSchema = z.object({
    roomId: z.string(),
    senderId: z.string(),
    content: z.string().min(1)
});
export const createMessage = async (input) => {
    const data = MessageSchema.parse(input);
    const id = crypto.randomUUID();
    const result = await pool.query(`
        INSERT INTO messages (id, room_id, sender_id, content)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [id, data.roomId, data.senderId, data.content]);
    return result.rows[0];
};
export const getMessagesByRoom = async (roomId) => {
    const result = await pool.query(`
        SELECT id, room_id, sender_id, content, status, created_at
        FROM messages
        WHERE room_id = $1
        ORDER BY created_at ASC
        `, [roomId]);
    return result.rows;
};
