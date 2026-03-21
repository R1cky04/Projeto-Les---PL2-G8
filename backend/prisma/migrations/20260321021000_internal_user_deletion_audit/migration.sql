-- Persistent audit trail for internal-user deletion actions.
CREATE TYPE "InternalUserDeletionAuditMode" AS ENUM ('DELETED', 'DEACTIVATED');

CREATE TABLE "InternalUserDeletionAuditLog" (
  "id" TEXT NOT NULL,
  "mode" "InternalUserDeletionAuditMode" NOT NULL,
  "actorUserId" TEXT NOT NULL,
  "actorUserIdentifier" TEXT NOT NULL,
  "targetUserId" TEXT NOT NULL,
  "targetUserIdentifier" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InternalUserDeletionAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InternalUserDeletionAuditLog_actorUserId_createdAt_idx"
  ON "InternalUserDeletionAuditLog"("actorUserId", "createdAt");

CREATE INDEX "InternalUserDeletionAuditLog_targetUserId_createdAt_idx"
  ON "InternalUserDeletionAuditLog"("targetUserId", "createdAt");
