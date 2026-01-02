export type MessageCreatedEvent = {
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

export type MessageUpdatedEvent = {
    type: "MESSAGE_UPDATED";
    payload: {
        messageId: string;
        roomId: string;
        status: "flagged" | "removed";
    };
};