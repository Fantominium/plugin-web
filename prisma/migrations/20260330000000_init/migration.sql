-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('organizer', 'admin');

-- CreateTable
CREATE TABLE "UserAccount" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'organizer',
  "isAllowlistedAdmin" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizerProfile" (
  "id" TEXT NOT NULL,
  "userAccountId" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "displayName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrganizerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizerProfile_userAccountId_key" ON "OrganizerProfile"("userAccountId");

-- AddForeignKey
ALTER TABLE "OrganizerProfile"
ADD CONSTRAINT "OrganizerProfile_userAccountId_fkey"
FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
