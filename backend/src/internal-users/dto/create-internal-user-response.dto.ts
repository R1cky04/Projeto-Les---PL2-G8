import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '@prisma/client';

// Success payload returned by the create-internal-user endpoint.
export interface CreatedInternalUserDto {
  id: string;
  userId: string;
  role: InternalUserRole;
  status: InternalUserStatus;
  isActive: boolean;
  requiresItValidation: boolean;
  permissions: InternalPermission[];
  createdAt: Date;
}

export interface CreateInternalUserResponseDto {
  message: string;
  user: CreatedInternalUserDto;
}
