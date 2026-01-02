import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);

console.log("[publisher] module loaded");

export async function  publishMessage(event: string, data: any) {
  console.log("[publisher] publishing", event);
  await redis.publish(
      "sentinel-events",
      JSON.stringify({ event, data })
  );
}