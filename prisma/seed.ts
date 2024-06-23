import { PrismaClient } from '@prisma/client';
import { clearStaticData } from './clear';
import { ages } from './seed-data/ages';
import { buildings } from './seed-data/buildings';
import { civs } from './seed-data/civs';
import { techs } from './seed-data/techs';
import { units } from './seed-data/units';

const API_VERSION = '1.0.0';
const GAME_VERSION = '107882';
export const VERSION_ID = 1;

let id = 1000;
function getUniqueId(): number {
  return id++;
}

function getAgeId(ageName: string): number {
  const age = ages.find((age) => age.ageName === ageName);

  if (!age) {
    throw new Error(`Age ${ageName} not found`);
  }

  return age.id;
}

let prisma = new PrismaClient();

export async function main(prismaClient?: PrismaClient) {
  if (prismaClient) prisma = prismaClient;

  await clearStaticData();

  console.log(`Preparing transactions...`);

  const ageTransactions = addAges();
  const unitTransactions = addUnits();
  const techTransactions = addTechs();
  const buildingTransactions = addBuildings();
  const civTransactions = addCivs();

  console.log(`✅ Transactions prepared`);
  console.log(`Applying transactions...`);

  await prisma.$transaction([
    ...ageTransactions,
    ...unitTransactions,
    ...techTransactions,
    ...buildingTransactions,
    ...civTransactions,
  ]);

  console.log(`✅ Transactions applied`);

  await addVersions();
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

function addAges() {
  const transactions = [] as any;

  ages.forEach((age) => {
    transactions.push(
      prisma.age.upsert({
        where: {
          id: age.id,
        },
        update: {},
        create: age,
      }),
    );
  });

  return transactions;
}

function addUnits() {
  const transactions = [] as any;

  units.forEach(async (unit) => {
    const id = getUniqueId();

    transactions.push(
      prisma.unit.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          unitName: unit.unitName,
          ageId: getAgeId(unit.age),
        },
      }),
    );
  });

  return transactions;
}

function addTechs() {
  const transactions = [] as any;

  techs.forEach(async (tech) => {
    const id = getUniqueId();

    transactions.push(
      prisma.tech.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          techName: tech.techName,
          ageId: getAgeId(tech.age),
        },
      }),
    );
  });

  return transactions;
}

function addBuildings() {
  const transactions = [] as any;

  buildings.forEach((building) => {
    const id = getUniqueId();

    transactions.push(
      prisma.building.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          buildingName: building.buildingName,
          ageId: getAgeId(building.age),
          units: {
            connect: building.units,
          },
          techs: {
            connect: building.techs,
          },
        },
      }),
    );
  });

  return transactions;
}

function addCivs() {
  const transactions = [] as any;

  civs.forEach((civ) => {
    const id = getUniqueId();

    transactions.push(
      prisma.civ.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          civName: civ.civName,
          units: {
            connect: civ.units,
          },
          techs: {
            connect: civ.techs,
          },
          buildings: {
            connect: civ.buildings,
          },
        },
      }),
    );
  });

  return transactions;
}

async function addVersions() {
  await prisma.version.upsert({
    where: {
      id: VERSION_ID,
    },
    update: {},
    create: {
      id: VERSION_ID,
      gameVersion: GAME_VERSION,
      apiVersion: API_VERSION,
    },
  });
}
