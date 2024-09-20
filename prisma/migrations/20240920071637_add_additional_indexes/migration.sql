-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");

-- CreateIndex
CREATE INDEX "Password_userId_idx" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Totp_userId_idx" ON "Totp"("userId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
