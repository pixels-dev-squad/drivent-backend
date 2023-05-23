import { Room } from '@prisma/client';
import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import bookingRepository from '@/repositories/booking-repository';

// async function listHotels(userId: number) {
//   const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
//   if (!enrollment) {
//     throw notFoundError();
//   }
//   const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

//   if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
//     throw cannotListHotelsError();
//   }
// }

async function getHotels(userId: number) {
  // await listHotels(userId);

  const hotels = await hotelRepository.findHotels();
  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }
  return hotels;
}

type RoomWithOcupation = Room & { ocupation: number };

async function getHotelsWithRooms(userId: number, hotelId: number) {
  // await listHotels(userId);

  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);
  if (!hotel || hotel.Rooms.length === 0) {
    throw notFoundError();
  }

  const hotelWithRoomsAndOcupation = await Promise.all(
    hotel.Rooms.map(async (room) => {
      const ocupation = (await bookingRepository.findByRoomId(room.id)).length;
      return { ...room, ocupation } as RoomWithOcupation;
    }),
  );
  hotel.Rooms = hotelWithRoomsAndOcupation;

  return hotel;
}

export default {
  getHotels,
  getHotelsWithRooms,
  // listHotels,
};
