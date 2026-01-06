import { WebSocket } from "ws";
import { publishMessage } from "../../redis/pubsub";
import { MessageEditedEvent } from "packages/common/src/events/message.events";

const API_URL = process.env.API_URL || "http://localhost:3000";

export const handleEditMessage = async(
    ws: WebSocket,
    payload: any
) => {
    const user = (ws as any).user;
    const { messageId, roomId, content } = payload;

    if(!user || !messageId || !roomId || !content) return;

    const res = await fetch(`${API_URL}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });

    if (!res.ok) return;

    const row = await res.json();

    const event: MessageEditedEvent = {
        type: "MESSAGE_EDITED",
        payload: {
            messageId: row.id,
            roomId: row.roomId,
            content: row.content,
            editedAt: row.editedAt
        }
    };

    publishMessage(event);
}