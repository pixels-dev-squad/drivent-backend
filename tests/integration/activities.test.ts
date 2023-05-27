import request from 'supertest';
import moment from 'moment';
import httpStatus from 'http-status';
import { activityRouter } from '@/routers';
import activitiesService from '@/services/activities-service';

jest.mock('@/services/activities-service', () => ({
  getActivitiesDays: jest.fn(),
}));

describe('GET /activities/days', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of formatted dates when the request is valid', async () => {
    const userId = 123;
    const mockDates = [{ date: new Date('2023-05-26') }, { date: new Date('2023-05-27') }];
    const expectedFormattedDates = [
      moment('2023-05-26').add(1, 'day').format('dddd, DD/MM'),
      moment('2023-05-27').add(1, 'day').format('dddd, DD/MM'),
    ];

    (activitiesService.getActivitiesDays as jest.Mock).mockResolvedValueOnce(mockDates);

    const response = await request(activityRouter).get('/activities/days').set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(expectedFormattedDates);
    expect(activitiesService.getActivitiesDays).toHaveBeenCalledWith(userId);
  });

  it('should pass the error to the error handling middleware when an error occurs in the service', async () => {
    const userId = 123;
    const errorMessage = 'Error retrieving activities days';

    (activitiesService.getActivitiesDays as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const nextMock = jest.fn();

    const response = await request(activityRouter).get('/activities/days').set('Authorization', 'Bearer valid-token');

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(new Error(errorMessage));
    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toHaveProperty('message', errorMessage);
    expect(activitiesService.getActivitiesDays).toHaveBeenCalledWith(userId);
  });
});
