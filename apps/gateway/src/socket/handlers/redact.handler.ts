import { WebSocket } from "ws";
import { publishMessage } from "../../redis/pubsub";
import { MessageRedactedEvent } from "packages/common/src/events/message.events";

const API_URL = process.env.API_URL || "http://localhost:3000";

export const handleRedactMessage = async(
    ws: WebSocket,
    payload: any
) => {
    const user = (ws as any).user;
    const { messageId, roomId } = payload;

    if (!user || !messageId || !roomId) return;

    const res = await fetch(`${API_URL}/messages/${messageId}`, {
        method: "DELETE"
    });

    if (!res.ok) return;

    const event: MessageRedactedEvent = {
        type: "MESSAGE_REDACTED",
        payload: {
            messageId,
            roomId,
            reason: "user"
        }
    };

    publishMessage(event);
}