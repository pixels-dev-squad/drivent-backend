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
      image: 'https://www.belmond.com/content/dam/belmond/Hotels/Americas/Brazil/Rio%20de%20Janeiro/Belmond%20Copacabana%20Palace/copacabana-palace-hero.jpg.transform/mobile/image.jpg',
    },
    {
      name: 'Grand Hyatt Rio de Janeiro',
      image: 'https://www.hyatt.com/content/dam/hyatt/hyattdam/images/2016/12/20/1211/Grand-Hyatt-Rio-de-Janeiro-P001-Aerial-View.jpg/Grand-Hyatt-Rio-de-Janeiro-P001-Aerial-View.16x9.jpg?imwidth=1920',
    },
    {
      name: 'Hilton Copacabana Rio de Janeiro',
      image: 'https://www.hiltonhotels.com/assets/img/Brasil/RiodeJaneiro/CopacabanaRio/riojw-resort-copacabana-beach-view.jpg',
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
