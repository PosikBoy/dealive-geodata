/*
  Warnings:

  - You are about to drop the column `source_query` on the `addresses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `addresses_address_source_query_idx` ON `addresses`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `source_query`,
    ADD COLUMN `beltway_distance` INTEGER NULL,
    ADD COLUMN `beltway_hit` ENUM('IN_MKAD', 'OUT_MKAD', 'IN_KAD', 'OUT_KAD') NULL,
    ADD COLUMN `metro` JSON NULL;

-- CreateTable
CREATE TABLE `address_queries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `query` VARCHAR(191) NOT NULL,
    `addressId` INTEGER NOT NULL,

    UNIQUE INDEX `address_queries_query_key`(`query`),
    INDEX `address_queries_query_idx`(`query`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address_queries` ADD CONSTRAINT `address_queries_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
