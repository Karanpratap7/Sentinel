import { WebSocket } from "ws";
import { addConnection } from "../connection.store.js";

export function handleJoinRoom(ws: WebSocket, payload: any) {
    const user = (ws as any).user;
    const { roomId } = payload;

    if (!roomId) return;

    (ws as any).roomId = roomId;
    addConnection(roomId, user.id, ws);

    ws.send(JSON.stringify({
        type: "JOINED_ROOM",
        roomId
    }));
}