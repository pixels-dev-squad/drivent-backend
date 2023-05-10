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
