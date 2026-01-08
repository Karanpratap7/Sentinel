import Redis from "ioredis";
import { getRoomConnections } from "../socket/connection.store.js";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);

export function startSubscriber() {
    redis.subscribe("sentinel-events");

    redis.on("message", (_channel, raw) => {
        const event = JSON.parse(raw);

        if (!event) return;

        switch (event.type) {
            case "MESSAGE_CREATED":
                broadcastToRoom(event.payload.roomId, event);
                break;

            case "USER_TYPING":
                broadcastToRoom(event.payload.roomId, event);
                break;

            case "MESSAGE_UPDATED":
                broadcastToRoom(event.payload.roomId, event);
                break;
        }
    });
}

function broadcastToRoom(roomId: string, message: any) {
    const connections = getRoomConnections(roomId);
    console.log("[subscriber] broadcasting to room:", roomId, "connections:", connections?.size);
    if (!connections) return;

    connections.forEach((ws, userId) => {
        if (
            message.type === "USER_TYPING" &&
            message.payload.userId === userId
        ) {
            return;
        }

        if (ws.readyState === ws.OPEN) {
            console.log("[subscriber] sending to user:", userId, "message:", message);
            ws.send(JSON.stringify(message));
        }
    });
}