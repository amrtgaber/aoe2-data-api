-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitName" TEXT NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "techs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "techName" TEXT NOT NULL,

    CONSTRAINT "techs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buildingName" TEXT NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CivToUnit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CivToTech" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BuildingToCiv" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "units_unitName_key" ON "units"("unitName");

-- CreateIndex
CREATE UNIQUE INDEX "techs_techName_key" ON "techs"("techName");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_buildingName_key" ON "buildings"("buildingName");

-- CreateIndex
CREATE UNIQUE INDEX "_CivToUnit_AB_unique" ON "_CivToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_CivToUnit_B_index" ON "_CivToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CivToTech_AB_unique" ON "_CivToTech"("A", "B");

-- CreateIndex
CREATE INDEX "_CivToTech_B_index" ON "_CivToTech"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BuildingToCiv_AB_unique" ON "_BuildingToCiv"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildingToCiv_B_index" ON "_BuildingToCiv"("B");

-- AddForeignKey
ALTER TABLE "_CivToUnit" ADD CONSTRAINT "_CivToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "civs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CivToUnit" ADD CONSTRAINT "_CivToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CivToTech" ADD CONSTRAINT "_CivToTech_A_fkey" FOREIGN KEY ("A") REFERENCES "civs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CivToTech" ADD CONSTRAINT "_CivToTech_B_fkey" FOREIGN KEY ("B") REFERENCES "techs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToCiv" ADD CONSTRAINT "_BuildingToCiv_A_fkey" FOREIGN KEY ("A") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToCiv" ADD CONSTRAINT "_BuildingToCiv_B_fkey" FOREIGN KEY ("B") REFERENCES "civs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
