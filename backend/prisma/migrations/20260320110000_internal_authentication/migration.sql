-- Internal authentication support for login, session tracking and IT accounts.
ALTER TYPE "InternalUserRole" ADD VALUE IF NOT EXISTS 'IT';

CREATE TABLE "InternalSession" (
  "id" TEXT NOT NULL,
  "tokenId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),

  CONSTRAINT "InternalSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InternalSession_tokenId_key" ON "InternalSession"("tokenId");
CREATE INDEX "InternalSession_userId_idx" ON "InternalSession"("userId");
CREATE INDEX "InternalSession_expiresAt_revokedAt_idx" ON "InternalSession"("expiresAt", "revokedAt");

ALTER TABLE "InternalSession"
ADD CONSTRAINT "InternalSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
