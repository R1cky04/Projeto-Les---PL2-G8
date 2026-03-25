-- CreateEnum
CREATE TYPE "InternalUserManagementAuditOutcome" AS ENUM ('UPDATED', 'PARTIAL');

-- CreateTable
CREATE TABLE "InternalUserManagementAuditLog" (
    "id" TEXT NOT NULL,
    "outcome" "InternalUserManagementAuditOutcome" NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorUserIdentifier" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "targetUserIdentifier" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalUserManagementAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternalUserManagementAuditLog_actorUserId_createdAt_idx" ON "InternalUserManagementAuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "InternalUserManagementAuditLog_targetUserId_createdAt_idx" ON "InternalUserManagementAuditLog"("targetUserId", "createdAt");
