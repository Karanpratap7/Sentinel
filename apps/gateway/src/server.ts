import {WebSocketServer, WebSocket } from "ws";
import { authenticateSocket } from "./auth/socket.auth.js";
import { routeMessage } from "./socket/socket.router.js";
import { removeConnection } from "./socket/connection.store.js";
import "./redis/subscriber.js"

export function setupWebSocket(wss: WebSocketServer) {
    wss.on("connection", async (ws: WebSocket, req) => {
        try {
            const user = await authenticateSocket(req);
            ws.user = user;

            ws.on("message", (data) => {
                routeMessage(ws, data.toString());
            });

            ws.on("close", () => {
                if (ws.roomId && ws.user) {
                removeConnection(ws.roomId, ws.user.id);
                }
            });

            console.log(JSON.stringify({
                service: "sentinel-gateway",
                event: "socket_connected",
                userId: (ws as any).user.id
            }));
        } catch {
            ws.close(1008, "Unauthorized");
        }
    });
}

