-- CreateTable
CREATE TABLE "drafts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CivToDraft" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CivToDraft_AB_unique" ON "_CivToDraft"("A", "B");

-- CreateIndex
CREATE INDEX "_CivToDraft_B_index" ON "_CivToDraft"("B");

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CivToDraft" ADD CONSTRAINT "_CivToDraft_A_fkey" FOREIGN KEY ("A") REFERENCES "civs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CivToDraft" ADD CONSTRAINT "_CivToDraft_B_fkey" FOREIGN KEY ("B") REFERENCES "drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
