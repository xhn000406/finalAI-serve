/*
  Warnings:

  - You are about to drop the column `tempUserId` on the `chat_records` table. All the data in the column will be lost.
  - You are about to drop the column `tempUserId` on the `chat_session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."chat_records_tempUserId_idx";

-- AlterTable
ALTER TABLE "public"."chat_records" DROP COLUMN "tempUserId";

-- AlterTable
ALTER TABLE "public"."chat_session" DROP COLUMN "tempUserId";
