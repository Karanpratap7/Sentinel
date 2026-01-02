import { WebSocket } from "ws";

type RoomId = string;
type UserId = string;

const rooms = new Map<RoomId, Map<UserId, WebSocket>>();

export function addConnection(
    roomId: string,
    userId: string,
    ws: WebSocket
) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
    }
    rooms.get(roomId)!.set(userId, ws);
}

export function removeConnection(
    roomId: string,
    userId: string
) {
    rooms.get(roomId)?.delete(userId);
    if (rooms.get(roomId)?.size === 0) {
        rooms.delete(roomId);
    }
}

export function getRoomConnections(roomId: string) {
    return rooms.get(roomId);
}