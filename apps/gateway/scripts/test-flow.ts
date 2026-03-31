import { WebSocket } from "ws";

const API_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

async function uniqueUser() {
    const id = Math.random().toString(36).substring(7);
    return {
        username: `user_${id}`,
        email: `user_${id}@example.com`,
        password: "password123"
    };
}

async function signup(user: any) {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Signup failed: ${res.status} ${text}`);
    }
    return res.json();
}

async function createRoom(token: string, name: string) {
    const res = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, type: "public" })
    });
    if (!res.ok) throw new Error(`Create Room failed: ${res.status}`);
    return res.json();
}

async function joinRoom(token: string, roomId: string) {
    const res = await fetch(`${API_URL}/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(`Join Room failed: ${res.status}`);
    return res.json();
}

function connect(token: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.on("open", () => resolve(ws));
        ws.on("error", reject);
    });
}

async function main() {
    try {
        console.log("Starting test flow...");

        // 1. Signup Users
        const userA = await uniqueUser();
        const userB = await uniqueUser();

        console.log("Signing up User A...");
        const authA = await signup(userA);
        const tokenA = authA.token;
        const idA = authA.user.id;

        console.log("Signing up User B...");
        const authB = await signup(userB);
        const tokenB = authB.token;

        // 2. Create Room
        console.log("User A creating room...");
        const room = await createRoom(tokenA, "Test Room");
        console.log("Room created:", room.id);

        // 3. User B Joins Room
        console.log("User B joining room...");
        await joinRoom(tokenB, room.id);

        // 4. Connect WebSockets
        console.log("Connecting User A to WS...");
        const wsA = await connect(tokenA);

        console.log("Connecting User B to WS...");
        const wsB = await connect(tokenB);

        // 5. Join Room via WS (to subscribe)
        wsA.send(JSON.stringify({ type: "JOIN_ROOM", roomId: room.id }));
        wsB.send(JSON.stringify({ type: "JOIN_ROOM", roomId: room.id }));

        // Wait to join
        await new Promise(r => setTimeout(r, 500));

        // 6. User A sends message
        console.log("User A sending message...");
        const msgContent = "Hello from User A!";

        // Listen for message on B
        const messagePromise = new Promise((resolve, reject) => {
            wsB.on("message", (data) => {
                const event = JSON.parse(data.toString());
                console.log("User B received:", event);
                if (event.type === "MESSAGE_CREATED" && event.payload.content === msgContent) {
                    resolve(true);
                }
            });
            // Timeout
            setTimeout(() => reject(new Error("Timeout waiting for message")), 5000);
        });

        wsA.send(JSON.stringify({
            type: "SEND_MESSAGE",
            roomId: room.id,
            content: msgContent
        }));

        await messagePromise;
        console.log("SUCCESS: User B received message!");

        wsA.close();
        wsB.close();
        process.exit(0);

    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

main();
