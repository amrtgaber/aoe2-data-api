-- AlterTable
ALTER TABLE "buildings" ADD COLUMN     "ageId" INTEGER;

-- AlterTable
ALTER TABLE "techs" ADD COLUMN     "ageId" INTEGER;

-- AlterTable
ALTER TABLE "units" ADD COLUMN     "ageId" INTEGER;

-- CreateTable
CREATE TABLE "ages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ageName" TEXT NOT NULL,

    CONSTRAINT "ages_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "ages_ageName_key" ON "ages"("ageName");

-- CreateIndex
CREATE UNIQUE INDEX "_BuildingToUnit_AB_unique" ON "_BuildingToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildingToUnit_B_index" ON "_BuildingToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BuildingToTech_AB_unique" ON "_BuildingToTech"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildingToTech_B_index" ON "_BuildingToTech"("B");

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "techs" ADD CONSTRAINT "techs_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_ageId_fkey" FOREIGN KEY ("ageId") REFERENCES "ages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToUnit" ADD CONSTRAINT "_BuildingToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToUnit" ADD CONSTRAINT "_BuildingToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToTech" ADD CONSTRAINT "_BuildingToTech_A_fkey" FOREIGN KEY ("A") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToTech" ADD CONSTRAINT "_BuildingToTech_B_fkey" FOREIGN KEY ("B") REFERENCES "techs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
