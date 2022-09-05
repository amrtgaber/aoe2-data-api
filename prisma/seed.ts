import { PrismaClient } from '@prisma/client';
import { civs } from './seed-data/civs';
import { units } from './seed-data/units';
import { techs } from './seed-data/techs';
import { buildings } from './seed-data/buildings';
import { ages } from './seed-data/ages';

const prisma = new PrismaClient();

async function main() {
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
  await prisma.age.deleteMany();

  ages.forEach(async (age) => {
    await prisma.age.upsert({
      where: {
        ageName: age.ageName,
      },
      update: {},
      create: { ageName: age.ageName },
    });
  });
}

async function addUnits() {
  await prisma.unit.deleteMany();

  units.forEach(async (unit) => {
    await prisma.unit.upsert({
      where: {
        unitName: unit.unitName,
      },
      update: {},
      create: { unitName: unit.unitName },
    });

    await prisma.age.update({
      where: {
        ageName: unit.age,
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
}

async function addTechs() {
  await prisma.tech.deleteMany();

  techs.forEach(async (tech) => {
    await prisma.tech.upsert({
      where: {
        techName: tech.techName,
      },
      update: {},
      create: { techName: tech.techName },
    });

    await prisma.age.update({
      where: {
        ageName: tech.age,
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
}

async function addBuildings() {
  await prisma.building.deleteMany();

  buildings.forEach(async (building) => {
    await prisma.building.upsert({
      where: {
        buildingName: building.buildingName,
      },
      update: {},
      create: { buildingName: building.buildingName },
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

    await prisma.age.update({
      where: {
        ageName: building.age,
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
}

async function addCivs() {
  await prisma.civ.deleteMany();

  civs.forEach(async (civ) => {
    await prisma.civ.upsert({
      where: {
        civName: civ.civName,
      },
      update: {},
      create: { civName: civ.civName },
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
