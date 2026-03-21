import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
import { InternalUsersService } from './internal-users.service';
export declare class InternalUsersController {
    private readonly internalUsersService;
    constructor(internalUsersService: InternalUsersService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
    findAll(): Promise<{
        id: string;
        userId: string | null;
        internalRole: import("@prisma/client").$Enums.InternalUserRole | null;
        internalStatus: import("@prisma/client").$Enums.InternalUserStatus;
        permissions: import("@prisma/client").$Enums.InternalPermission[];
        requiresItValidation: boolean;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    remove(id: string, request: AuthenticatedRequest): Promise<DeleteInternalUserResponseDto>;
}
