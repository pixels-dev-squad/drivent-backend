import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { create } from 'domain';
import { Hotel } from '@prisma/client';

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
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1',
    },
    {
      name: 'Grand Hyatt Rio de Janeiro',
      image: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg',
    },
    {
      name: 'Hilton Copacabana Rio de Janeiro',
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/99/7c/20/exterior.jpg?w=700&h=-1&s=1',
    },
  ];


  async function createHotel() {
    let hotel = await prisma.hotel.findFirst();
    if (!hotel) {
      const hotel = await prisma.hotel.createMany({
        data: hotelsToCreate,
      });
    }
  
    console.log({ hotel });
  }
  
  createHotel()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });


    const RoomstoCreate = [
      {
        name: 'Room 10',
        capacity: 3,
        hotelId: 4
      },
      {
        name: 'Room 11',
        capacity: 3,
        hotelId: 4
      },
      {
        name: 'Room 12',
        capacity: 2,
        hotelId:4
      },
      {
        name: 'Room 13',
        capacity: 2,
        hotelId: 4
      },
      {
        name: 'Room 14',
        capacity: 3,
        hotelId: 4
      },
      {
        name: 'Room 15',
        capacity: 2,
        hotelId:4
      },


      {
        name: 'Room 01',
        capacity: 1,
        hotelId: 5
      },
      {
        name: 'Room 02',
        capacity: 1,
        hotelId: 5
      },
      {
        name: 'Room 03',
        capacity: 2,
        hotelId:5
      },
      {
        name: 'Room 04',
        capacity: 1,
        hotelId: 5
      },
      {
        name: 'Room 05',
        capacity: 1,
        hotelId: 5
      },
      {
        name: 'Room 06',
        capacity: 2,
        hotelId:5
      },


      {
        name: 'Room 100',
        capacity: 1,
        hotelId: 6
      },
      {
        name: 'Room 101',
        capacity: 2,
        hotelId: 6
      },
      {
        name: 'Room 102',
        capacity: 3,
        hotelId: 6
      },
      {
        name: 'Room 104',
        capacity: 3,
        hotelId: 6
      },
      {
        name: 'Room 105',
        capacity: 2,
        hotelId: 6
      },
      {
        name: 'Room 106',
        capacity: 1,
        hotelId: 6
      },
    ];

    async function creatRooms() {
      let room = await prisma.room.findFirst();
      if (!room) {
        const rooms = await prisma.room.createMany({
          data: RoomstoCreate,
        });
      }
    
      console.log({ room });
    }
    
    creatRooms()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });