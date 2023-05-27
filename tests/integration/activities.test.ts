import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createTicket,
  createPayment,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createActivity } from '../factories/activities-factory';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /days', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities/days');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if enrollment was not founded', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticket status is reserved', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticketType is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 when its ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/activities/days').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe('POST /by-date', () => {
  it('should respond with status 401 if no token is given', async () => {
    const date = '2023-06-12';
    const response = await server.post('/activities/by-date').send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const date = '2023-06-12';
    const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const date = faker.date.future();
    const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if enrollment was not founded', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const date = '2023-06-12';
      console.log({ date });
      const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const date = faker.date.future();

      const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticket status is reserved', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const date = faker.date.future();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticketType is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const date = faker.date.future();

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 when its ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const date = '2023-06-12';
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities/by-date').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe('GET /user', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities/user');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if enrollment was not founded', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticket status is reserved', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticketType is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 when its ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/activities/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe('POST /', () => {
  it('should respond with status 401 if no token is given', async () => {
    const date = '2023-06-12';
    const response = await server.post('/activities').send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const date = '2023-06-12';
    const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const date = faker.date.future();
    const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if enrollment was not founded', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const date = '2023-06-12';
      console.log({ date });
      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const date = faker.date.future();

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticket status is reserved', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const date = faker.date.future();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 when ticketType is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const date = faker.date.future();

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 when there is no activity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const date = '2023-06-12';
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.OK);
    });

    it('should respond with status 200 when its ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const date = '2023-06-12';
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activity = await createActivity();
      console.log(activity);
      // const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ date });

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});
