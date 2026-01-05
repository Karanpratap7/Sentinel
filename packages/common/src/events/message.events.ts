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

export type { MessageCreatedEvent, MessageUpdatedEvent, UserTypingEvent };
export type GatewayEvent =
    | MessageCreatedEvent
    | MessageUpdatedEvent
    | UserTypingEvent;