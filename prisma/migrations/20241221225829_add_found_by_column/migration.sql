/*
  Warnings:

  - A unique constraint covering the columns `[found_by]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `found_by` VARCHAR(191) NOT NULL DEFAULT 'Адрес';

-- CreateIndex
CREATE UNIQUE INDEX `addresses_found_by_key` ON `addresses`(`found_by`);

-- CreateIndex
CREATE INDEX `addresses_found_by_idx` ON `addresses`(`found_by`);
