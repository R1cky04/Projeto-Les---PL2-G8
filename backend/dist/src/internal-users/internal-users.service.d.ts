import { AuthenticatedUserDto } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
import { ListInternalUsersResponseDto } from './dto/list-internal-users-response.dto';
import { PasswordHasherService } from './password-hasher.service';
export declare class InternalUsersService {
    private readonly prisma;
    private readonly passwordHasher;
    private static readonly DEFAULT_PAGE;
    private static readonly DEFAULT_PAGE_SIZE;
    private static readonly MAX_PAGE_SIZE;
    private readonly logger;
    constructor(prisma: PrismaService, passwordHasher: PasswordHasherService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
    private ensureUserIdIsUnique;
    findAll(pageInput?: number | string, pageSizeInput?: number | string, searchInput?: string): Promise<ListInternalUsersResponseDto>;
    remove(id: string, actor: AuthenticatedUserDto): Promise<DeleteInternalUserResponseDto>;
    private softDeleteUser;
    private deleteUser;
    private buildDeletionAuditEntry;
}
