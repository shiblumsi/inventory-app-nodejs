/*
  Warnings:

  - Added the required column `transactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;
