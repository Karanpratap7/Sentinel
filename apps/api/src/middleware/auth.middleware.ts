import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(); // Don't block here, let route handlers check if they need user
        // Or if we want to enforce authentication for applied routes:
        // But some routes might be public.
        // However, I will apply this middleware globally or to specific routes.
        // Let's make it populate user if token is valid, otherwise leave it undefined.
        // The routes checks `if (!req.user)`.
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        (req as AuthRequest).user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };
        next();
    } catch (err) {
        // Invalid token
        // Should we block or just continue without user?
        // If header is present but invalid, it's safer to reject or ignore.
        // Let's ignore and let route handle 401 if user is missing.
        console.warn("[Auth Middleware] Invalid token:", (err as Error).message);
        next();
    }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as AuthRequest).user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
