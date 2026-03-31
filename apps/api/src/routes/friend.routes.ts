import { Router } from "express";
import { pool } from "../db/pool.js";

export const friendRouter = Router();

// Send Friend Request
friendRouter.post("/request", async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { targetUsername } = req.body;
        if (!targetUsername) return res.status(400).json({ error: "targetUsername required" });

        // Find target user
        const userRes = await pool.query("SELECT id FROM users WHERE username = $1", [targetUsername]);
        if (userRes.rowCount === 0) return res.status(404).json({ error: "User not found" });

        const targetUserId = userRes.rows[0].id;

        if (targetUserId === userId) return res.status(400).json({ error: "Cannot add self" });

        // Ensure unique pair order: user_id_1 < user_id_2
        // If we want to check if friendship exists, check specifically for this pair
        const [u1, u2] = userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];

        const friendCheck = await pool.query(
            "SELECT * FROM friends WHERE user_id_1 = $1 AND user_id_2 = $2",
            [u1, u2]
        );

        if (friendCheck.rowCount && friendCheck.rowCount > 0) {
            return res.status(409).json({ error: "Friendship already exists or pending" });
        }

        await pool.query(
            "INSERT INTO friends (user_id_1, user_id_2, status) VALUES ($1, $2, 'pending')",
            [u1, u2]
        );

        res.status(201).json({ message: "Friend request sent" });

    } catch (err) {
        console.error("[Friend] Request error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Accept Request
friendRouter.post("/accept", async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { requesterId } = req.body;
        if (!requesterId) return res.status(400).json({ error: "requesterId required" });

        const [u1, u2] = userId < requesterId ? [userId, requesterId] : [requesterId, userId];

        const result = await pool.query(
            "UPDATE friends SET status = 'accepted' WHERE user_id_1 = $1 AND user_id_2 = $2 RETURNING *",
            [u1, u2]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.json({ message: "Friend request accepted" });
    } catch (err) {
        console.error("Friend accept error", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// List Friends
friendRouter.get("/", async (req, res) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const result = await pool.query(
            `
            SELECT u.id, u.username, u.email, u.image_url 
            FROM users u
            JOIN friends f ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
            WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1)
            AND u.id != $1
            AND f.status = 'accepted'
            `,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error("[Friend] List error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
