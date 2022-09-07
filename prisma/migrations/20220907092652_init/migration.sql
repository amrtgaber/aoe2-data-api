-- CreateTable
CREATE TABLE "civs" (
    "id" SERIAL NOT NULL,
    "civName" TEXT NOT NULL,

    CONSTRAINT "civs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "unitName" TEXT NOT NULL,
    "ageId" INTEGER NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "techs" (
    "id" SERIAL NOT NULL,
    "techName" TEXT NOT NULL,
    "ageId" INTEGER NOT NULL,

    CONSTRAINT "techs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" SERIAL NOT NULL,
    "buildingName" TEXT NOT NULL,
    "ageId" INTEGER NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ages" (
    "id" SERIAL NOT NULL,
    "ageName" TEXT NOT NULL,

    CONSTRAINT "ages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameVersion" TEXT NOT NULL,
    "apiVersion" TEXT NOT NULL,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_BuildingToUnit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BuildingToTech" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "civs_civName_key" ON "civs"("civName");

-- CreateIndex
CREATE UNIQUE INDEX "units_unitName_key" ON "units"("unitName");

-- CreateIndex
CREATE UNIQUE INDEX "techs_techName_key" ON "techs"("techName");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_buildingName_key" ON "buildings"("buildingName");

-- CreateIndex
CREATE UNIQUE INDEX "ages_ageName_key" ON "ages"("ageName");

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

-- CreateIndex
CREATE UNIQUE INDEX "_BuildingToUnit_AB_unique" ON "_BuildingToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildingToUnit_B_index" ON "_BuildingToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BuildingToTech_AB_unique" ON "_BuildingToTech"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildingToTech_B_index" ON "_BuildingToTech"("B");

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "techs" ADD CONSTRAINT "techs_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_BuildingToUnit" ADD CONSTRAINT "_BuildingToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToUnit" ADD CONSTRAINT "_BuildingToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToTech" ADD CONSTRAINT "_BuildingToTech_A_fkey" FOREIGN KEY ("A") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToTech" ADD CONSTRAINT "_BuildingToTech_B_fkey" FOREIGN KEY ("B") REFERENCES "techs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
