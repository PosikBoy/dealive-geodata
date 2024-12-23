-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `geo_lat` VARCHAR(191) NOT NULL,
    `geo_lon` VARCHAR(191) NOT NULL,
    `qc_geo` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `addresses_address_key`(`address`),
    INDEX `addresses_geo_lat_geo_lon_idx`(`geo_lat`, `geo_lon`),
    INDEX `addresses_address_idx`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
