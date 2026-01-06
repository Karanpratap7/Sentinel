type MessageCreatedEvent = {
    type: "MESSAGE_CREATED";
    payload: {
        id: string;
        roomdId: string;
        senderId: string;
        content: string;
        status: "visible";
        createdAt: string;
    };
};

type MessageUpdatedEvent = {
    type: "MESSAGE_UPDATED";
    payload: {
        messageId: string;
        roomId: string;
        status: "flagged" | "removed";
    };
};

type UserTypingEvent = {
    type: "USER_TYPING";
    payload: {
        roomId: string;
        userId: string;
    };
};

type MessageEditedEvent = {
    type: "MESSAGE_EDITED";
    payload: {
        messageId: string;
        roomId: string;
        content: string;
        editedAt: string;
    };
};

type MessageRedactedEvent = {
    type: "MESSAGE_REDACTED";
    payload: {
        messageId: string;
        roomId: string;
        reason?: "moderation" | "user";
    };
};

export type { MessageCreatedEvent, MessageUpdatedEvent, UserTypingEvent, MessageEditedEvent, MessageRedactedEvent };
export type GatewayEvent =
    | MessageCreatedEvent
    | MessageUpdatedEvent
    | UserTypingEvent
    | MessageEditedEvent
    | MessageRedactedEvent;