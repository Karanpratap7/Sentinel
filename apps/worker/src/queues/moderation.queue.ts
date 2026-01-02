import { Queue } from "bullmq";
const { default: Redis } = await import("ioredis");

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const moderationQueue = new Queue("moderation", {
  connection
});