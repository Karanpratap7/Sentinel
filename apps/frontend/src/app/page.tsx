"use client";

import { useState } from "react";
import { connect, send } from "../../lib/socket";
import { fetchHistory } from "../../lib/api";
import { GatewayEvent } from "@sentinel/common/events/message.events";

export default function Page() {
  const [log, setLog] = useState<string[]>([]);
  const [roomId] = useState("room-1");
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);

  function append(msg: string) {
    setLog(l => [...l, msg]);
  }

  function onEvent(e: GatewayEvent) {
    switch (e.type) {
      case "MESSAGE_CREATED": {
        const { sender_id, content } = e.payload;
        append(`${sender_id}: ${content}`);
        break;
      }

      case "MESSAGE_EDITED": {
        append(`✏️${e.payload.messageId} edited: ${e.payload.content}`);
        break;
      }

      case "MESSAGE_REDACTED": {
        append(`🗑️${e.payload.messageId} was removed`);
        break;
      }

      case "USER_TYPING": {
        append(`${e.payload.userId} is typing...`);
        break;
      }

      default: {
        append(JSON.stringify(e));
      }
    }
  }

  async function join() {
    send({ type: "JOIN_ROOM", roomId });
    setJoined(true);

    const history = await fetchHistory(roomId);
    history.forEach((m: any) => {
      append(`${m.sender_id}: ${m.content}`);
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        fontFamily: "system-ui, monospace",
        color: "#eaeaea",
      }}
    >
      <div
        style={{
          width: 600,
          background: "#161616",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Socket Room</h2>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => {
              connect("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMiIsInVzZXJuYW1lIjoiQiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY3MzYwMjYxfQ.2gYrsV2itVWIHNKdZeJr9zQtcc2e2Woc8-W72vE4I6M", onEvent);
              setConnected(true);
            }}
            disabled={connected}
            style={buttonStyle}
          >
            {connected ? "Connected" : "Connect"}
          </button>

          <button
            onClick={join}
            disabled={!connected || joined}
            style={buttonStyle}
          >
            {joined ? "Joined" : "Join"}
          </button>

          <button
            onClick={() =>
              send({ type: "SEND_MESSAGE", roomId, content: "hello" })
            }
            disabled={!joined}
            style={buttonStyle}
          >
            Send
          </button>
        </div>

        <pre
          style={{
            height: 300,
            overflow: "auto",
            background: "#0c0c0c",
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            lineHeight: 1.5,
            color: "#cfcfcf",
          }}
        >
          {log.join("\n")}
        </pre>
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#242424",
  color: "#fff",
  border: "1px solid #333",
  cursor: "pointer",
};