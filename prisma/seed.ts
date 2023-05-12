import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const possibleTicketTypes = [
  { name: 'Presencial + Com Hotel', price: 600, isRemote: false, includesHotel: true },
  { name: 'Presencial + Sem Hotel', price: 250, isRemote: false, includesHotel: false },
  { name: 'Online', price: 100, isRemote: true, includesHotel: false },
];

async function createTicketType() {
  let countTicketTypes = await prisma.ticketType.count();
  if (countTicketTypes !== 3) {
    await prisma.ticketType.deleteMany();
    const ticketsType = await prisma.ticketType.createMany({
      data: possibleTicketTypes,
    });

    console.log({ ticketsType });
  }
}

createTicketType()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const hotelsToCreate = [
  {
    name: 'Belmond Copacabana Palace',
    image:
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1',
  },
  {
    name: 'Grand Hyatt Rio de Janeiro',
    image:
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg',
  },
  {
    name: 'Hilton Copacabana Rio de Janeiro',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/99/7c/20/exterior.jpg?w=700&h=-1&s=1',
  },
];

async function createHotel() {
  let hotel = await prisma.hotel.count();
  if (hotel !== 3) {
    await prisma.hotel.deleteMany();
    const hotels = await prisma.hotel.createMany({
      data: hotelsToCreate,
    });

    console.log({ hotels });
  }
}

createHotel()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// const hotels = await prisma.hotel.findMany();

async function createRooms() {
  const consultRooms = await prisma.room.count();
  if (consultRooms === 0) {
    const hotels = await prisma.hotel.findMany();

    const rooms: { name: string; capacity: number; hotelId: number }[] = [];

    hotels.forEach((hotel) => {
      const floors = Math.floor(Math.random() * 10) + 1;
      const roomsPerFloor = Math.floor(Math.random() * 16) + 5;

      for (let floor = 0; floor < floors; floor++) {
        const floorNumber = floor === 0 ? '' : floor;
        for (let roomNumber = 1; roomNumber <= roomsPerFloor; roomNumber++) {
          const roomName =
            floorNumber === ''
              ? `${roomNumber.toString().padStart(2, '0')}`
              : roomNumber <= 9
              ? `${floorNumber}0${roomNumber}`
              : `${floorNumber}${roomNumber}`;
          const capacity = Math.floor(Math.random() * 3) + 1;
          rooms.push({ name: roomName, capacity, hotelId: hotel.id });
        }
      }
    });

    const roomsCreated = await prisma.room.createMany({ data: rooms });

    console.log({ roomsCreated });
  }
}

createRooms()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
