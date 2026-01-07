import { GatewayEvent } from "../../../packages/common/src/events/message.events.js";

let socket: WebSocket | null = null;

export function connect(token: string, onEvent: (e: GatewayEvent) => void) {
    socket = new WebSocket(`ws://localhost:3001?token=${token}`);

    socket.onmessage = (ev) => {
        const event: GatewayEvent = JSON.parse(ev.data);
        onEvent(event);
    };

    socket.onopen = () => console.log("connected");
    socket.onclose = () => console.log("disconnected");
}

export function send(data:any) {
    socket?.send(JSON.stringify(data));
}