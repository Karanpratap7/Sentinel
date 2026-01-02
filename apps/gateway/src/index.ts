import { createServer } from "http";
import { WebSocketServer } from "ws";
import { setupWebSocket } from "./server.js";
import { startSubscriber } from "./redis/subscriber.js";

const server = createServer();
const wss = new WebSocketServer({ server });

setupWebSocket(wss);
startSubscriber();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[sentinel-gateway] listening on port ${PORT}`);
});