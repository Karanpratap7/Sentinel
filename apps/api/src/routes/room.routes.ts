import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

export const roomRouter = Router();

const CreateRoomSchema = z.object({
    name: z.string().min(1),
    type: z.enum(["public", "private", "direct"]).default("public")
});

// Create Room
roomRouter.post("/", async (req, res) => {
    try {
        const { name, type } = CreateRoomSchema.parse(req.body);
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Create room
            const roomResult = await client.query(
                "INSERT INTO rooms (name, type) VALUES ($1, $2) RETURNING *",
                [name, type]
            );
            const room = roomResult.rows[0];

            // Add creator as owner
            await client.query(
                "INSERT INTO room_users (room_id, user_id, role) VALUES ($1, $2, 'owner')",
                [room.id, userId]
            );

            await client.query("COMMIT");
            res.status(201).json(room);

        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }

    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error("[Room] Validation error:", err.errors);
            return res.status(400).json({ error: err.errors });
        }
        console.error("[Room] Create error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// List User's Rooms
roomRouter.get("/", async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const result = await pool.query(
            `SELECT r.* 
             FROM rooms r
             JOIN room_users ru ON r.id = ru.room_id
             WHERE ru.user_id = $1
             ORDER BY r.updated_at DESC`,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error("[Room] List error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Join Room
roomRouter.post("/:roomId/join", async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        // Check if already in room
        const check = await pool.query(
            "SELECT * FROM room_users WHERE room_id = $1 AND user_id = $2",
            [roomId, userId]
        );

        if (check.rowCount && check.rowCount > 0) {
            return res.json({ message: "Already joined" });
        }

        await pool.query(
            "INSERT INTO room_users (room_id, user_id, role) VALUES ($1, $2, 'member')",
            [roomId, userId]
        );

        res.json({ message: "Joined successfully" });

    } catch (err) {
        console.error("[Room] Join error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
