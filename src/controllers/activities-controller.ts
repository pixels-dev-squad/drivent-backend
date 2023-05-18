import moment from 'moment';
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';

export async function listActivitiesDays(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const dates = await activitiesService.getActivitiesDays(userId);
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    next(error);
  }
}

export async function listActivitiesByDate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { date } = req.body as Record<string, string>;
    const formatedDate = moment(date, 'DD/MM').format('YYYY-MM-DD');

    const activities = await activitiesService.getActivitiesByDate(userId, formatedDate);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function listUserActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const activities = await activitiesService.getUserActivities(userId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function bookActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { activityId } = req.body as Record<string, number>;

    const record = await activitiesService.registerOnActivity(userId, activityId);
    return res.status(httpStatus.OK).send(record);
  } catch (error) {
    next(error);
  }
}
