import moment from 'moment';
import { conflictError, notFoundError, unauthorizedError } from '@/errors';
import activitiesRepository from '@/repositories/activities-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function verifyPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }
}

function transformActivitiesArray(activities: any[]): any[] {
  const transformedArray: any[] = [];

  for (const activity of activities) {
    const { locale, ...activityData } = activity;

    let existingEntry = transformedArray.find((entry) => entry.locale === locale);

    if (!existingEntry) {
      existingEntry = { locale, activities: [] };
      transformedArray.push(existingEntry);
    }

    const formattedActivityData = {
      ...activityData,
      date: new Date(activityData.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      startsAt: new Date(activityData.startsAt).toLocaleTimeString('pt-BR', { timeZone: 'UTC' }),
      endsAt: new Date(activityData.endsAt).toLocaleTimeString('pt-BR', { timeZone: 'UTC' }),
    };

    existingEntry.activities.push(formattedActivityData);
  }

  return transformedArray;
}

async function getActivitiesDays(userId: number) {
  await verifyPayment(userId);

  const dates = await activitiesRepository.getActivitiesDays();
  const formatedDates: string[] = [];

  for (const dateObj of dates) {
    const formatedDate = moment(dateObj.date).add(1, 'day').format('dddd, DD/MM');
    formatedDates.push(formatedDate);
  }
  return formatedDates;
}

async function getActivitiesByDate(userId: number, date: string) {
  verifyPayment(userId);

  const activities = await activitiesRepository.getActivitiesByDate(date);
  const result = transformActivitiesArray(activities);

  return result;
}

async function getUserActivities(userId: number) {
  verifyPayment(userId);

  const activities = await activitiesRepository.getActivitiesByUserId(userId);
  return activities;
}

async function registerOnActivity(userId: number, activityId: number) {
  verifyPayment(userId);

  const activity = await activitiesRepository.getActivityById(activityId);
  if (!activity) throw notFoundError();

  const userActivities = await activitiesRepository.getActivitiesByUserId(userId);

  const conflictingActivity = userActivities.find((userActivity: any) => {
    const userActivityDate = new Date(userActivity.Activity.date);
    const userActivityStartsAt = new Date(userActivity.Activity.startsAt);
    const userActivityEndsAt = new Date(userActivity.Activity.endsAt);

    const activityDate = new Date(activity.date);
    const activityStartsAt = new Date(activity.startsAt);
    const activityEndsAt = new Date(activity.endsAt);

    return (
      activityDate.getTime() === userActivityDate.getTime() &&
      ((activityStartsAt >= userActivityStartsAt && activityStartsAt < userActivityEndsAt) ||
        (activityEndsAt > userActivityStartsAt && activityEndsAt <= userActivityEndsAt))
    );
  });

  if (conflictingActivity) {
    throw conflictError('The user is already enrolled in an activity at the same time.');
  }

  const record = await activitiesRepository.registerOnActivity(userId, activityId);
  return record;
}

export default {
  getActivitiesDays,
  getActivitiesByDate,
  getUserActivities,
  registerOnActivity,
};
