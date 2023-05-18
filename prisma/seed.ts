import { Activity, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import moment from 'moment';
import faker from '@faker-js/faker';

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

async function createActivities() {
  const locales = ['Auditório Principal', 'Auditório Lateral', 'Sala de Workshop'];
  const activities: Omit<Activity, 'id'>[] = [];

  const startDate = moment().add(20, 'days').startOf('day').toDate();
  const endDate = moment(startDate).add(4, 'days').startOf('day').toDate();

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const existingEvents: { [key: string]: { startsAt: Date; endsAt: Date } } = {};

    for (const locale of locales) {
      const firstActivityStartsAt = moment(currentDate).set('hour', 6).set('minute', 0).set('second', 0);

      const startHour = moment(firstActivityStartsAt);

      const firstActivity: Omit<Activity, 'id'> = {
        name: faker.random.boolean() ? faker.company.companyName() : faker.commerce.productName(),
        locale,
        capacity: Math.floor(Math.random() * (50 - 5 + 1)) + 5,
        date: currentDate,
        startsAt: firstActivityStartsAt.toDate(),
        endsAt: moment(firstActivityStartsAt).add(60, 'minutes').toDate(),
      };

      activities.push(firstActivity);
      existingEvents[locale] = { startsAt: firstActivityStartsAt.toDate(), endsAt: firstActivity.endsAt };

      startHour.add(60, 'minutes');

      while (startHour.isBefore(moment(currentDate).set('hour', 17))) {
        const name = faker.random.boolean() ? faker.company.companyName() : faker.commerce.productName();
        const capacity = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

        const duration = Math.floor(Math.random() * (240 - 60 + 1)) + 60;

        const startsAt = moment(startHour).set('minute', 0).toDate();
        const intervalDuration = Math.random() < 0.5 ? 20 : 30;

        const endsAt = moment(startHour)
          .add(duration, 'minutes')
          .add(intervalDuration, 'minutes')
          .set('seconds', 0)
          .toDate();

        const overlappingEvent = Object.values(existingEvents).find(
          (event) => startsAt < event.endsAt && endsAt > event.startsAt,
        );

        if (!overlappingEvent || overlappingEvent.startsAt === startsAt) {
          const activity: Omit<Activity, 'id'> = {
            name,
            locale,
            capacity,
            date: currentDate,
            startsAt,
            endsAt,
          };

          activities.push(activity);

          if (!existingEvents[locale]) {
            existingEvents[locale] = { startsAt, endsAt };
          } else {
            existingEvents[locale].endsAt = endsAt;
          }
        }

        startHour.add(duration, 'minutes').add(intervalDuration, 'minutes');
      }
    }

    currentDate = moment(currentDate).add(1, 'day').startOf('day').toDate();
  }

  await prisma.activity.createMany({ data: activities });
}

createActivities()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
