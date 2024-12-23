/*
  Warnings:

  - You are about to drop the column `found_by` on the `addresses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `addresses_address_idx` ON `addresses`;

-- DropIndex
DROP INDEX `addresses_found_by_idx` ON `addresses`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `found_by`,
    ADD COLUMN `source_query` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `addresses_address_source_query_idx` ON `addresses`(`address`, `source_query`);
