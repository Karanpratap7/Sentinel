import Redis from "ioredis";
import type {
  MessageCreatedEvent,
  MessageUpdatedEvent,
  UserTypingEvent
} from "packages/common/src/events/message.events.js";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null
  }
);


export async function  publishMessage(event: MessageCreatedEvent | MessageUpdatedEvent | UserTypingEvent) {
  await redis.publish(
      "sentinel-events",
      JSON.stringify(event)
  );
}