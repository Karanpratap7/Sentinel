import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod"; // Using z from zod, assuming it's available
import { pool } from "../db/pool.js";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const SignupSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    imageUrl: z.string().optional()
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

authRouter.post("/signup", async (req, res) => {
    try {
        const { username, email, password, imageUrl } = SignupSchema.parse(req.body);

        // Check if user exists
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (userCheck.rowCount && userCheck.rowCount > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, image_url)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, image_url, created_at`,
            [username, email, passwordHash, imageUrl || null]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({ user, token });

    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.error("[Auth] Signup error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = LoginSchema.parse(req.body);

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Don't send password hash back
        delete user.password_hash;

        res.json({ user, token });

    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.error("[Auth] Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
