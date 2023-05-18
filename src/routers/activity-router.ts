import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookActivity, listActivitiesByDate, listActivitiesDays, listUserActivities } from '@/controllers';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/days', listActivitiesDays)
  .get('/by-date', listActivitiesByDate)
  .get('/user', listUserActivities)
  .post('/', bookActivity);

export { activityRouter };
