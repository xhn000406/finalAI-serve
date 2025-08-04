-- CreateTable
CREATE TABLE `chat_records` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `tempUserId` VARCHAR(191) NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `chat_records_userId_idx`(`userId`),
    INDEX `chat_records_tempUserId_idx`(`tempUserId`),
    INDEX `chat_records_createdAt_idx`(`createdAt`),
    INDEX `chat_records_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
