import Joi from 'joi';
import { InputTicketBody, InputTicketTypeBody } from '@/protocols';

export const ticketsSchema = Joi.object<InputTicketBody>({
  ticketTypeId: Joi.number().required(),
});

export const ticketTypesSchema = Joi.object<InputTicketTypeBody>({
  name: Joi.string().required(),
  price: Joi.number().required(),
  isRemote: Joi.boolean().required(),
  includesHotel: Joi.boolean().required(),
});
