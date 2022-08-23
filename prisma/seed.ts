import { PrismaClient } from '@prisma/client';
import { civs } from './seed-data/civs';

const prisma = new PrismaClient();

async function main() {
  await prisma.civ.deleteMany({});

  civs.forEach(async (civ) => {
    await prisma.civ.upsert({
      where: {
        civName: civ.civName,
      },
      update: {},
      create: civ,
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
