import { z } from "zod";
import { pool } from "../db/pool.js";
import crypto from "crypto";

const MessageSchema = z.object({
    roomId: z.string(),
    senderId: z.string(),
    content: z.string().min(1)
});

export const createMessage = async (input: unknown) => {
    const data = MessageSchema.parse(input);

    const id = crypto.randomUUID();

    const result = await pool.query(
        `
        INSERT INTO messages (id, room_id, sender_id, content)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [id, data.roomId, data.senderId, data.content]
    );

    return result.rows[0];
}

export const getMessagesByRoom = async (roomId: string) => {
    const result = await pool.query(
        `
        SELECT id, room_id, sender_id, content, status, created_at
        FROM messages
        WHERE room_id = $1
        ORDER BY created_at ASC
        `,
        [roomId]
    );

    return result.rows;
}

export const editMessage = async (messageId: string, content: string) => {
    const result = await pool.query(
        `
        UPDATE messages
        SET content = $1
        WHERE id = $2
        RETURNING *
        `,
        [content, messageId]
    );

    return result.rows[0];
}

export const redactMessage = async (messageId: string) => {
    const result = await pool.query(
        `
        UPDATE messages
        SET status = 'removed',
            content = '[message removed]'
        WHERE id = $1
        RETURNING *
        `,
        [messageId]
    );

    return result.rows[0];
}