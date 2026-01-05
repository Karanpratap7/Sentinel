import { WebSocket } from "ws";
import { publishMessage } from "../../redis/pubsub.js";
import { canSendMessage } from "../../redis/rateLimit.js";
import { toMessageCreatedEvent } from "../../mappers/message.mapper.js";

const API_URL = process.env.API_URL || "http://localhost:3000";
const QUEUE_URL = process.env.QUEUE_URL || "http://localhost:3002";

export async function handleSendMessage(
    ws:WebSocket,
    payload:{
        roomId: string;
        content: string;
    }
)   {
    if (!ws.user) return;
    const user = ws.user;
    const { roomId, content } = payload;

    if (!await canSendMessage(roomId, user.id)) {
        ws.send(JSON.stringify({
            type: "ERROR",
            payload: { message: "Rate limit exceeded" }
        }));
        return;
    }

    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
            roomId: payload.roomId,
            senderId: user.id,
            content: payload.content
        })
    });

    if (!response.ok) return;

    const message = await response.json();

    const event = toMessageCreatedEvent(message);
    publishMessage(event);

    // enqueue moderation (fire and forget)
    fetch(`${QUEUE_URL}/moderate`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
            messageId: message.id,
            content: message.content
        })
    }).catch(err => {
        console.warn("[gateway] moderation service unavailable: ", err);
    }); 
}