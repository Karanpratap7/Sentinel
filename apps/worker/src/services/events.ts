const { default: Redis } = await import("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const publishEvent = async (event: string, data: any) => {
    await redis.publish(
        "sentinel-events",
        JSON.stringify({ event, data })
    );
}