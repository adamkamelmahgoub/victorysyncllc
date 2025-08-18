
import { createQueue, createWorker, createQueueEvents, ensureScheduler, addJob } from '../server/lib/bullmqCompat.js'

const QUEUE_NAME = 'sync'

export const syncQueue = createQueue(QUEUE_NAME)

async function bootstrap() {
  createQueueEvents(QUEUE_NAME)
  await ensureScheduler(QUEUE_NAME) // starts only on v3; no-op on v4/v5

  // Worker logic
  createWorker(QUEUE_NAME, async (job) => {
    // switch(job.name) for hubspot/twilio syncs
    // backoff + retry is configured via job opts
    console.log(`[bullmq] Processing job ${job.name} with data:`, job.data)
    return { ok: true, type: job.name }
  })

  console.log(`[bullmq] Worker initialized for queue '${QUEUE_NAME}'`)
}

export async function enqueueSync(name: string, data: any, opts?: any) {
  await addJob(syncQueue, name, data, { 
    attempts: 5, 
    backoff: { type: 'exponential', delay: 1000 }, 
    removeOnComplete: 1000, 
    removeOnFail: 5000, 
    ...(opts || {}) 
  })
}

bootstrap().catch(err => {
  console.error('[worker] bootstrap failed', err)
  process.exit(1)
})
