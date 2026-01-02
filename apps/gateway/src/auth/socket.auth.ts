import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingMessage } from "http";

type AuthUser = {
    id: string;
    username?: string;
    role?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function authenticateSocket(req: IncomingMessage): Promise<AuthUser> {
    const url = new URL(req.url || "", "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
        throw new Error("Missing token");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== "object" || !("id" in decoded)) {
        throw new Error("Invalid token payload");
    }

    const user: AuthUser = {
        id: decoded.id as string,
        username: decoded.username as string | undefined,
        role: decoded.role as string | undefined
    };

    return user;
}

// Review this again 