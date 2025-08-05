-- CreateTable
CREATE TABLE "public"."chat_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tempUserId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "chat_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_records_userId_idx" ON "public"."chat_records"("userId");

-- CreateIndex
CREATE INDEX "chat_records_tempUserId_idx" ON "public"."chat_records"("tempUserId");

-- CreateIndex
CREATE INDEX "chat_records_createdAt_idx" ON "public"."chat_records"("createdAt");

-- CreateIndex
CREATE INDEX "chat_records_status_idx" ON "public"."chat_records"("status");
