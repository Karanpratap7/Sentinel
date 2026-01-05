import { WebSocket }  from "ws";
import { publishMessage } from "../../redis/pubsub.js";
import { setTyping } from "../../redis/typing.js";
import { UserTypingEvent } from "packages/common/src/events/message.events.js";

export async function handleTyping(ws: WebSocket, payload: any) {
    const user = (ws as any).user;
    const { roomId } = payload;

    if (!roomId || !user) return;

    await setTyping(roomId, user.id);

    const event: UserTypingEvent = {
        type: "USER_TYPING",
        payload: {
            roomId,
            userId: user.id
        }
    };

    publishMessage(event);
}
