-- AlterTable
ALTER TABLE "_LinkToTag" ADD CONSTRAINT "_LinkToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LinkToTag_AB_unique";
