
import IORedis from 'ioredis'
import * as Bull from 'bullmq'

export type QueueCompat = InstanceType<typeof (Bull as any).Queue>
export type WorkerCompat = InstanceType<typeof (Bull as any).Worker>
export type QueueEventsCompat = InstanceType<typeof (Bull as any).QueueEvents>

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
export const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })

const { Queue, Worker, QueueEvents } = Bull as any
const QueueScheduler = (Bull as any).QueueScheduler // v3 only; undefined on v4/v5

/** Create a queue (works on all versions) */
export function createQueue(name: string): QueueCompat {
  return new Queue(name, { connection })
}

/** Create a worker (works on all versions) */
export function createWorker(
  name: string,
  processor: Bull.Processor<any, any, string>,
  opts: Omit<Bull.WorkerOptions, 'connection'> = {}
): WorkerCompat {
  return new Worker(name, processor, { connection, ...opts })
}

/** Subscribe to queue events */
export function createQueueEvents(name: string): QueueEventsCompat {
  const events = new QueueEvents(name, { connection })
  // Optional: centralized logging
  events.on('completed', ({ jobId }) => console.log(`[bullmq] ${name} job ${jobId} completed`))
  events.on('failed', ({ jobId, failedReason }) => console.error(`[bullmq] ${name} job ${jobId} failed: ${failedReason}`))
  return events
}

/** Start a scheduler if available (v3); no-op on v4/v5 */
export async function ensureScheduler(name: string): Promise<void> {
  if (typeof QueueScheduler === 'function') {
    const scheduler = new QueueScheduler(name, { connection })
    // @ts-ignore - only present on some versions
    if (typeof scheduler.waitUntilReady === 'function') {
      await scheduler.waitUntilReady()
    }
    console.log(`[bullmq] QueueScheduler started for '${name}' (v3)`)
  } else {
    console.log(`[bullmq] QueueScheduler not needed for '${name}' (v4/v5)`)
  }
}

/** Add a delayed or repeatable job in a version-safe way */
export async function addJob(
  queue: QueueCompat,
  name: string,
  data: any,
  opts?: Bull.JobsOptions
): Promise<Bull.Job<any, any, string>> {
  return queue.add(name, data, opts)
}
