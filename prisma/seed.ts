import { PrismaClient } from '@prisma/client';
import { civs } from './seed-data/civs';
import { units } from './seed-data/units';
import { techs } from './seed-data/techs';
import { buildings } from './seed-data/buildings';
import { ages } from './seed-data/ages';
import { clearDatabase } from './clear';

const API_VERSION = '1.0.0';
const GAME_VERSION = '66692';
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

const prisma = new PrismaClient();

async function main() {
  await clearDatabase();

  await addAges();
  await addUnits();
  await addTechs();
  await addBuildings();
  await addCivs();
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

async function addAges() {
  await prisma.age.createMany({
    data: ages,
  });
}

async function addUnits() {
  const unitsData = units.map((unit) => {
    return {
      id: getUniqueId(),
      unitName: unit.unitName,
      ageId: getAgeId(unit.age),
    };
  });

  await prisma.unit.createMany({
    data: unitsData,
  });
}

async function addTechs() {
  const techsData = techs.map((tech) => {
    return {
      id: getUniqueId(),
      techName: tech.techName,
      ageId: getAgeId(tech.age),
    };
  });

  await prisma.tech.createMany({
    data: techsData,
  });
}

async function addBuildings() {
  await buildings.forEach(async (building) => {
    const ageId = getAgeId(building.age);

    await prisma.building.create({
      data: {
        id: getUniqueId(),
        buildingName: building.buildingName,
        ageId,
        units: {
          connect: building.units,
        },
        techs: {
          connect: building.techs,
        },
      },
    });
  });
}

async function addCivs() {
  await civs.forEach(async (civ) => {
    await prisma.civ.create({
      data: {
        id: getUniqueId(),
        civName: civ.civName,
        units: {
          connect: civ.units,
        },
        techs: {
          connect: civ.techs,
        },
      },
    });

    await prisma.civ.update({
      where: {
        civName: civ.civName,
      },
      data: {
        buildings: {
          connect: civ.buildings,
        },
      },
    });
  });
}

async function addVersions() {
  await prisma.version.create({
    data: {
      id: VERSION_ID,
      gameVersion: GAME_VERSION,
      apiVersion: API_VERSION,
    },
  });
}
