import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function clearDatabase() {
  await prisma.unit.deleteMany();
  await prisma.tech.deleteMany();
  await prisma.building.deleteMany();
  await prisma.civ.deleteMany();
  await prisma.age.deleteMany();
  await prisma.version.deleteMany();
}

async function main() {
  await clearDatabase();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
