import { WebSocket } from "ws";
import { handleSendMessage } from "./handlers/message.handler.js";
import { handleTyping } from "./handlers/typing.handler.js";
import { handleJoinRoom } from "./handlers/join.handler.js";

export function routeMessage(ws: WebSocket, raw: string) {
    console.log("[router] incoming raw:", raw);

    let payload;

    try {
        payload = JSON.parse(raw);
    } catch (err) {
        console.error("[router] JSON parse failed", err);
        return;
    }

    console.log("[router] parsed payload:", payload);
    console.log("[router] payload.type =", payload.type);

    switch (payload.type) {
        case "JOIN_ROOM":
            handleJoinRoom(ws, payload);
            break;
        case "SEND_MESSAGE":
            console.log("[router] payload.type =", payload.type);
            handleSendMessage(ws, payload);
            break;
        case "TYPING":
            handleTyping(ws, payload);
            break;
        default:
            //silently ignore junk
            break;
    }
}