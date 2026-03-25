import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../internal-user.enums';

export type InternalUserUpdateOutcome = 'UPDATED' | 'PARTIAL';

// Response contract for the IT workflow that edits an existing internal user.
export interface UpdatedInternalUserDto {
  id: string;
  userId: string;
  internalRole: InternalUserRole;
  internalStatus: InternalUserStatus;
  permissions: InternalPermission[];
  requiresItValidation: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface UpdateInternalUserResponseDto {
  message: string;
  outcome: InternalUserUpdateOutcome;
  warnings: string[];
  user: UpdatedInternalUserDto;
}
