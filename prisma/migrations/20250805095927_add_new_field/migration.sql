-- AlterTable
ALTER TABLE "public"."chat_records" ADD COLUMN     "roomId" TEXT NOT NULL DEFAULT 'temp-default-room-id';

-- CreateTable
CREATE TABLE "public"."chat_session" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT,
    "tempUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMP(3),

    CONSTRAINT "chat_session_pkey" PRIMARY KEY ("roomId")
);
