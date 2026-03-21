import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '@prisma/client';
import type { Request } from 'express';

// Shared auth contracts used by the service layer, guards and frontend API.
export const FEATURE_KEYS = [
  'INTERNAL_USERS',
  'CUSTOMERS',
  'RESERVATIONS',
  'RENTALS',
  'VEHICLES',
  'FLEET_OPERATIONS',
] as const;

export type InternalFeatureKey = (typeof FEATURE_KEYS)[number];
export type InternalFeatureStatus =
  | 'AVAILABLE'
  | 'LIMITED'
  | 'TEMPORARILY_DISABLED';
export type SessionAccessLevel = 'FULL' | 'LIMITED';

export interface AuthenticatedFeatureDto {
  key: InternalFeatureKey;
  label: string;
  description: string;
  status: InternalFeatureStatus;
  reason?: string;
}

export interface AuthenticatedUserDto {
  id: string;
  userId: string;
  fullName: string | null;
  role: InternalUserRole;
  status: InternalUserStatus;
  isActive: boolean;
  accessLevel: SessionAccessLevel;
  permissions: InternalPermission[];
}

export interface AuthenticatedSessionDto {
  token?: string;
  expiresAt: Date;
  concurrentSessionCount: number;
  warnings: string[];
}

export interface AuthSessionResponseDto {
  message: string;
  session: AuthenticatedSessionDto;
  user: AuthenticatedUserDto;
  features: AuthenticatedFeatureDto[];
}

export interface AuthenticatedSessionContext {
  sessionId: string;
  tokenId: string;
  user: AuthenticatedUserDto;
  expiresAt: Date;
  concurrentSessionCount: number;
  warnings: string[];
  features: AuthenticatedFeatureDto[];
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthenticatedSessionContext;
}
