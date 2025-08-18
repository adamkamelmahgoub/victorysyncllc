
import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';
import Redis from 'ioredis';
const connection = new Redis(process.env.REDIS_URL as string);

export const syncQueue = new Queue('sync', { connection });
new QueueScheduler('sync', { connection });

new Worker('sync', async (job) => {
  // switch(job.name) for hubspot/twilio syncs
  // backoff + retry is configured via job opts
  return { ok: true, type: job.name };
}, { connection });

export async function enqueueSync(name:string, data:any, opts?:JobsOptions){
  await syncQueue.add(name, data, { attempts: 5, backoff:{ type:'exponential', delay: 1000 }, removeOnComplete: 1000, removeOnFail: 5000, ...(opts||{}) });
}
