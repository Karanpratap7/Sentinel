import { Worker } from "bullmq";
const { default: Redis } = await import("ioredis");
import { moderate } from "../service/moderator.js";
import { updateMessageStatus } from "../services/message.repo.js";


const connection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
  { maxRetriesPerRequest: null }
);

new Worker(
    "moderation",
    async (job) => {
        const { messageId, content } = job.data;

        const result = await moderate(content);

        if (result.action == "remove") {
            await updateMessageStatus(messageId, "removed");
        }

        if (result.action == "flag") {
            await updateMessageStatus(messageId, "flagged");
        }

        console.log(JSON.stringify({
            service: "sentinel-worker",
            event: "moderation_complete",
            messageId,
            action: result.action
        }));
        
    },
    { connection}
);

