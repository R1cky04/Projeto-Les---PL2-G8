-- CreateEnum
CREATE TYPE "InternalUserRole" AS ENUM ('ADMIN', 'STAFF', 'FLEET');

-- CreateEnum
CREATE TYPE "InternalUserStatus" AS ENUM ('ACTIVE', 'PENDING_IT_VALIDATION');

-- CreateEnum
CREATE TYPE "InternalPermission" AS ENUM (
  'RESERVATION_READ',
  'RENTAL_READ',
  'VEHICLE_READ',
  'VEHICLE_WRITE',
  'MAINTENANCE_WRITE',
  'TRANSFER_WRITE',
  'INCIDENT_WRITE',
  'USER_READ',
  'USER_CREATE',
  'USER_ACTIVATE'
);

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "internalRole" "InternalUserRole",
ADD COLUMN "internalStatus" "InternalUserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "isInternal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "permissions" "InternalPermission"[] DEFAULT ARRAY[]::"InternalPermission"[],
ADD COLUMN "requiresItValidation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "userId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
