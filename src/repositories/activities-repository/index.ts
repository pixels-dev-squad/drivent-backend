import { prisma } from '@/config';

async function getActivitiesDays() {
  return prisma.activity.findMany({
    select: {
      date: true,
    },
    distinct: ['date'],
  });
}

async function getActivitiesByDate(date: string) {
  const parsedDate = new Date(date);
  return prisma.activity.findMany({
    where: {
      date: parsedDate,
    },
  });
}

async function getActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
  });
}

async function getActivitiesByUserId(userId: number) {
  return prisma.activities_booking.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function registerOnActivity(userId: number, activityId: number) {
  return prisma.activities_booking.create({
    data: {
      userId,
      activityId,
    },
  });
}

export default {
  getActivitiesDays,
  getActivitiesByDate,
  getActivityById,
  getActivitiesByUserId,
  registerOnActivity,
};
