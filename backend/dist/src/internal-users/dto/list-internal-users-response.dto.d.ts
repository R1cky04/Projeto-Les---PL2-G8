import { InternalPermission, InternalUserRole, InternalUserStatus } from '@prisma/client';
export interface InternalUserListItemDto {
    id: string;
    userId: string | null;
    internalRole: InternalUserRole | null;
    internalStatus: InternalUserStatus;
    permissions: InternalPermission[];
    requiresItValidation: boolean;
    isActive: boolean;
    createdAt: Date;
}
export interface InternalUsersPaginationDto {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
export interface ListInternalUsersResponseDto {
    items: InternalUserListItemDto[];
    pagination: InternalUsersPaginationDto;
}
