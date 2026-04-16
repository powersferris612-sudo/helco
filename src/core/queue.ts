import { Queue } from 'bullmq';
import { config } from './config';

const hasRedis = Boolean(process.env.REDIS_URL);

class NoopQueue {
  async add() {
    return { id: 'noop' };
  }
}

export const workflowQueue = hasRedis
  ? new Queue('workflow', {
      connection: { url: config.redisUrl } as never
    })
  : (new NoopQueue() as unknown as Queue);