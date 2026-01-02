import express, { Request, Response} from "express";
const { default: Redis } = await import("ioredis");
import { Worker } from "bullmq";

// 🔹 Side-effect import: this registers the processor
import "./processors/moderation.processor.js";

const app = express();
app.use(express.json());

// Redis connection shared by BullMQ
const connection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// Simple health check so you know the worker is alive
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "sentinel-worker"
  });
});

// Optional: accept moderation jobs via HTTP
// (Gateway uses this)
app.post("/moderate", async (req: Request, res: Response) => {
  const { moderationQueue } = await import(
    "./queues/moderation.queue.js"
  );

  const { messageId, content } = req.body;

  if (!messageId || !content) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  await moderationQueue.add("moderate-message", {
    messageId,
    content
  });

  res.sendStatus(202);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`[sentinel-worker] listening on ${PORT}`);
});

// Keep process alive & log Redis issues
connection.on("connect", () => {
  console.log("[sentinel-worker] connected to Redis");
});

connection.on("error", (err: Error) => {
  console.error("[sentinel-worker] Redis error", err);
});