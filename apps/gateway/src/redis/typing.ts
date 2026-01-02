import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);
const TYPING_TTL = 3; //seconds

export async function setTyping(
    roomId: string,
    userId: string 
) {
    const key = `typing:${roomId}:${userId}`;
    await redis.set(key, "1", "EX", TYPING_TTL);
}

export async function isTyping(
    roomId: string,
    userId: string
) {
    const key = `typing:${roomId}:${userId}`;
    return redis.exists(key);
}
