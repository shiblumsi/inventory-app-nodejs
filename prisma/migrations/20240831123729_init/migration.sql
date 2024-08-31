-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer';
