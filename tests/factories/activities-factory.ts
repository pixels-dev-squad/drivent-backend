import { Activity } from '@prisma/client';
import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createActivity() {
  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      locale: faker.name.findName(),
      capacity: faker.datatype.number(),
      date: faker.date.future(),
      startsAt: faker.date.future(),
      endsAt: faker.date.future(),
    },
  });
}
