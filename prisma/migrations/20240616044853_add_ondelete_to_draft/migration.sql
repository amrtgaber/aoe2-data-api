-- DropForeignKey
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
