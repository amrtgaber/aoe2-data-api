import { PrismaClient } from '@prisma/client';
import { techTree } from './seed-data/tech-tree';
import { units } from './seed-data/units';
import { techs } from './seed-data/techs';
import { buildings } from './seed-data/buildings';

const prisma = new PrismaClient();

async function main() {
  await addUnits();
  await addTechs();
  await addBuildings();
  await addTechTrees();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function addUnits() {
  await prisma.unit.deleteMany();

  units.forEach(async (unit) => {
    await prisma.unit.upsert({
      where: {
        unitName: unit.unitName,
      },
      update: {},
      create: unit,
    });
  });
}

async function addTechs() {
  await prisma.tech.deleteMany();

  techs.forEach(async (tech) => {
    await prisma.tech.upsert({
      where: {
        techName: tech.techName,
      },
      update: {},
      create: tech,
    });
  });
}

async function addBuildings() {
  await prisma.building.deleteMany();

  buildings.forEach(async (building) => {
    await prisma.building.upsert({
      where: {
        buildingName: building.buildingName,
      },
      update: {},
      create: building,
    });
  });
}

async function addTechTrees() {
  await prisma.civ.deleteMany();

  techTree.forEach(async (techTree) => {
    await prisma.civ.upsert({
      where: {
        civName: techTree.civName,
      },
      update: {},
      create: { civName: techTree.civName },
    });

    techTree.units.forEach(async (unit) => {
      await prisma.civ.update({
        where: {
          civName: techTree.civName,
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

    techTree.techs.forEach(async (tech) => {
      await prisma.civ.update({
        where: {
          civName: techTree.civName,
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

    techTree.buildings.forEach(async (building) => {
      await prisma.civ.update({
        where: {
          civName: techTree.civName,
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
