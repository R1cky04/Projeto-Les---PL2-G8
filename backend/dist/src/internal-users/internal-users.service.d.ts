import { AuthenticatedUserDto } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
import { PasswordHasherService } from './password-hasher.service';
export declare class InternalUsersService {
    private readonly prisma;
    private readonly passwordHasher;
    private readonly logger;
    constructor(prisma: PrismaService, passwordHasher: PasswordHasherService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
    private ensureUserIdIsUnique;
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
    remove(id: string, actor: AuthenticatedUserDto): Promise<DeleteInternalUserResponseDto>;
    private softDeleteUser;
    private deleteUser;
    private buildDeletionAuditEntry;
}
