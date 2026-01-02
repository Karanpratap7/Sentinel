import { WebSocket }  from "ws";
import { publishMessage } from "../../redis/pubsub.js";
import { setTyping } from "../../redis/typing.js";

export async function handleTyping(ws: WebSocket, payload: any) {
    const user = (ws as any).user;
    const { roomId } = payload;

    if (!roomId) return;

    await setTyping(roomId, user.id);

    await publishMessage("USER_TYPING", {
        roomId: payload.roomId,
        userId: user.id
    });
}
