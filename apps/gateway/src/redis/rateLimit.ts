import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);

const WINDOW_SECONDS = 10;
const MAX_MESSAGES = 20;

export const canSendMessage = async (
    roomId: string,
    userId: string
): Promise<boolean> => {
    const key = `rate:${roomId}:${userId}`;

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, WINDOW_SECONDS);;
    }

    return count <= MAX_MESSAGES;
}