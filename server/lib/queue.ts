
// server/lib/queue.ts
import { ENV } from "./env";

// Lazy import to avoid loading BullMQ when not needed
type Bull = typeof import("bullmq");
type IORedis = typeof import("ioredis")["default"];

export type SyncJobPayload = { type: string; payload?: unknown };

let bullmq: Bull | null = null;
let RedisCtor: IORedis | null = null;

const queueName = "sync";

export async function getQueue() {
  if (!ENV.REDIS_URL) {
    // No Redis – provide an in-memory no-op queue.
    return {
      add: async (_name: string, _data: SyncJobPayload) => {},
    };
  }

  if (!bullmq) {
    bullmq = await import("bullmq");
  }
  if (!RedisCtor) {
    const mod = await import("ioredis");
    RedisCtor = mod.default;
  }

  const connection = new RedisCtor(ENV.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const { Queue } = bullmq!;
  const q = new Queue<SyncJobPayload>(queueName, { connection });
  return q;
}

export async function startWorker(onJob: (job: SyncJobPayload) => Promise<void>) {
  if (!ENV.REDIS_URL) {
    console.info("[bullmq] Redis not configured – worker disabled (no-op).");
    return;
  }

  if (!bullmq) {
    bullmq = await import("bullmq");
  }
  if (!RedisCtor) {
    const mod = await import("ioredis");
    RedisCtor = mod.default;
  }

  const connection = new RedisCtor(ENV.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const { Worker, QueueEvents } = bullmq!;
  // v4: QueueScheduler not required for basic processing
  const events = new QueueEvents(queueName, { connection });
  events.on("failed", ({ jobId, failedReason }) => {
    console.error(`[bullmq] job ${jobId} failed:`, failedReason);
  });

  const worker = new Worker<SyncJobPayload>(
    queueName,
    async (job) => {
      await onJob(job.data);
    },
    { connection }
  );

  worker.on("error", (err) => console.error("[bullmq] worker error:", err));
  console.info("[bullmq] Worker initialized for queue '%s'", queueName);
}
