import { prisma } from '@/config';
import { redis } from '@/config/redis';

async function findFirst() {
  const eventKey = 'event';
  const cachedEvent = await redis.get(eventKey);

  if (cachedEvent) {
    return JSON.parse(cachedEvent);
  }

  const result = await prisma.event.findFirst();

  await redis.set(eventKey, JSON.stringify(result));

  return result;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
