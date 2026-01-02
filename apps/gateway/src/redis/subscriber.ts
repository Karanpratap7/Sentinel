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
        console.log("[subscriber] raw:", raw);

        const parsed = JSON.parse(raw);
        const event = parsed.event;
        const data = parsed.data;

        console.log("[subscriber] event:", event);

        if (!event || !data) return;

        switch (event) {
            case "MESSAGE_CREATED":
                broadcastToRoom(data.room_id, {
                    type: "MESSAGE_CREATED",
                    payload: data
                });
                break;

            case "USER_TYPING":
                broadcastToRoom(data.room_id, {
                    type: "USER_TYPING",
                    payload: data
                });
                break;

            case "MESSAGE_UPDATED":
                broadcastToRoom(data.room_id, {
                    type: "MESSAGE_UPDATED",
                    payload: {
                        messageId: data.messageId,
                        roomId: data.room_id,
                        status: data.status
                    }
                });
                break;
        }
    });
}

function broadcastToRoom(room_id: string, message: any) {
    const connections = getRoomConnections(room_id);
    console.log("[subscriber] broadcasting to room:", room_id, "connections:", connections?.size);
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