import type { MessageCreatedEvent } from "packages/common/src/events/message.events.js";

export function toMessageCreatedEvent(row: any): MessageCreatedEvent {
    return {
        type: "MESSAGE_CREATED",
        payload: {
            id: row.id,
            roomdId: row.room_id,
            senderId: row.sender_id,
            content: row.content,
            status: row.status,
            createdAt: row.created_at
        }
    };
}