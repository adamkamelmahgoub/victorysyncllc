
// server/lib/bullmqCompat.ts
import IORedis from 'ioredis'
import * as Bull from 'bullmq'
import type {
  Queue as BullQueueT,
  Worker as BullWorkerT,
  QueueEvents as BullQueueEventsT,
  Processor,
  WorkerOptions,
  JobsOptions,
  Job,
} from 'bullmq'

/**
 * Version-safe BullMQ compatibility layer.
 * - If running on v3, a QueueScheduler will be started.
 * - On v4/v5, scheduler is not needed and this is a no-op.
 * - Does not change any public UI/DB behavior.
 */

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
export const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })

// Pull runtime constructors from the Bull namespace
const { Queue: BullQueue, Worker: BullWorker, QueueEvents: BullQueueEvents } = Bull as any
const BullQueueScheduler = (Bull as any).QueueScheduler // undefined on v4/v5

export type QueueCompat = BullQueueT<any, any, string>
export type WorkerCompat = BullWorkerT<any, any, string>
export type QueueEventsCompat = BullQueueEventsT

export function createQueue(name: string): QueueCompat {
  return new BullQueue(name, { connection }) as QueueCompat
}

export function createWorker(
  name: string,
  processor: Processor<any, any, string>,
  opts: Omit<WorkerOptions, 'connection'> = {}
): WorkerCompat {
  return new BullWorker(name, processor as any, { connection, ...(opts as any) }) as WorkerCompat
}

export function createQueueEvents(name: string): QueueEventsCompat {
  const events = new BullQueueEvents(name, { connection }) as QueueEventsCompat
  events.on('completed', ({ jobId }) =>
    console.log(`[bullmq] ${name} job ${jobId} completed`)
  )
  events.on('failed', ({ jobId, failedReason }) =>
    console.error(`[bullmq] ${name} job ${jobId} failed: ${failedReason}`)
  )
  return events
}

export async function ensureScheduler(name: string): Promise<void> {
  if (typeof BullQueueScheduler === 'function') {
    const scheduler = new BullQueueScheduler(name, { connection })
    if (typeof (scheduler as any).waitUntilReady === 'function') {
      await (scheduler as any).waitUntilReady()
    }
    console.log(`[bullmq] QueueScheduler started for '${name}' (v3)`)
  } else {
    console.log(`[bullmq] QueueScheduler not needed for '${name}' (v4/v5)`)
  }
}

export async function addJob(
  queue: QueueCompat,
  name: string,
  data: any,
  opts?: JobsOptions
): Promise<Job<any, any, string>> {
  // Casting keeps this version-agnostic
  return (queue as any).add(name, data, opts)
}
