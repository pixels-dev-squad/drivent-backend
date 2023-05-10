import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { CreateTicketParams, CreateTicketTypeParams, InputTicketTypeBody } from '@/protocols';

async function getTicketType(): Promise<TicketType[]> {
  const ticketTypes: TicketType[] = await ticketsRepository.findTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function createTicketType({
  name,
  price,
  isRemote,
  includesHotel,
  userId,
}: InputTicketTypeBody & { userId: number }): Promise<TicketType> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticketTypeData: CreateTicketTypeParams = { name, price, isRemote, includesHotel };

  const ticketType = await ticketsRepository.createTicketType(ticketTypeData);

  return ticketType;
}

async function getTicketByUserId(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticketData: CreateTicketParams = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  return ticket;
}

const ticketService = { getTicketType, createTicketType, getTicketByUserId, createTicket };

export default ticketService;
