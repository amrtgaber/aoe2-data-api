import { PrismaClient } from '@prisma/client';
import { civs } from './seed-data/civs';
import { units } from './seed-data/units';
import { techs } from './seed-data/techs';
import { buildings } from './seed-data/buildings';
import { ages } from './seed-data/ages';
import { clearDatabase } from './clear';

let id = 1000;
function getUniqueId() {
  id++;
  return id;
}

function getAgeId(ageName: string) {
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
  ages.forEach(async (age) => {
    const { id, ageName } = age;

    await prisma.age.upsert({
      where: {
        ageName,
      },
      update: {},
      create: { id, ageName },
    });
  });
}

async function addUnits() {
  units.forEach(async (unit) => {
    const ageId = getAgeId(unit.age);

    await prisma.unit.upsert({
      where: {
        unitName: unit.unitName,
      },
      update: {},
      create: { id: getUniqueId(), unitName: unit.unitName, ageId },
    });
  });
}

async function addTechs() {
  techs.forEach(async (tech) => {
    const ageId = getAgeId(tech.age);

    await prisma.tech.upsert({
      where: {
        techName: tech.techName,
      },
      update: {},
      create: { id: getUniqueId(), techName: tech.techName, ageId },
    });
  });
}

async function addBuildings() {
  buildings.forEach(async (building) => {
    const ageId = getAgeId(building.age);

    await prisma.building.upsert({
      where: {
        buildingName: building.buildingName,
      },
      update: {},
      create: { id: getUniqueId(), buildingName: building.buildingName, ageId },
    });

    building.units.forEach(async (unit) => {
      await prisma.building.update({
        where: {
          buildingName: building.buildingName,
        },
        data: {
          units: {
            connect: {
              unitName: unit.unitName,
            },
          },
        },
      });
    });

    building.techs.forEach(async (tech) => {
      await prisma.building.update({
        where: {
          buildingName: building.buildingName,
        },
        data: {
          techs: {
            connect: {
              techName: tech.techName,
            },
          },
        },
      });
    });
  });
}

async function addCivs() {
  civs.forEach(async (civ) => {
    await prisma.civ.upsert({
      where: {
        civName: civ.civName,
      },
      update: {},
      create: { id: getUniqueId(), civName: civ.civName },
    });

    civ.units.forEach(async (unit) => {
      await prisma.civ.update({
        where: {
          civName: civ.civName,
        },
        data: {
          units: {
            connect: {
              unitName: unit.unitName,
            },
          },
        },
      });
    });

    civ.techs.forEach(async (tech) => {
      await prisma.civ.update({
        where: {
          civName: civ.civName,
        },
        data: {
          techs: {
            connect: {
              techName: tech.techName,
            },
          },
        },
      });
    });

    civ.buildings.forEach(async (building) => {
      await prisma.civ.update({
        where: {
          civName: civ.civName,
        },
        data: {
          buildings: {
            connect: {
              buildingName: building.buildingName,
            },
          },
        },
      });
    });
  });
}
