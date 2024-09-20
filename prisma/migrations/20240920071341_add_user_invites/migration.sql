-- CreateTable
CREATE TABLE "UserInvite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorUserId" TEXT,
    "inviteeUserId" TEXT,

    CONSTRAINT "UserInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInvite_inviteeUserId_key" ON "UserInvite"("inviteeUserId");

-- CreateIndex
CREATE INDEX "UserInvite_creatorUserId_idx" ON "UserInvite"("creatorUserId");

-- CreateIndex
CREATE INDEX "UserInvite_inviteeUserId_idx" ON "UserInvite"("inviteeUserId");

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_inviteeUserId_fkey" FOREIGN KEY ("inviteeUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
