import { InternalPermission, InternalUserRole, InternalUserStatus } from '@prisma/client';
export declare function getPermissionsForRole(role: InternalUserRole): InternalPermission[];
export declare function requiresItValidation(role: InternalUserRole): boolean;
export declare function getInitialStatusForRole(role: InternalUserRole): InternalUserStatus;
