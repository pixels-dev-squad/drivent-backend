import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, createTicketType, getTicketTypes, getTickets } from '@/controllers';
import { ticketTypesSchema, ticketsSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .post('/types', validateBody(ticketTypesSchema), createTicketType)
  .get('/', getTickets)
  .post('/', validateBody(ticketsSchema), createTicket);

export { ticketsRouter };
