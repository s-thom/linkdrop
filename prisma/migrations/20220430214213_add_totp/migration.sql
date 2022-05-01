-- CreateTable
CREATE TABLE "Totp" (
    "secret" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Totp_userId_key" ON "Totp"("userId");

-- AddForeignKey
ALTER TABLE "Totp" ADD CONSTRAINT "Totp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
