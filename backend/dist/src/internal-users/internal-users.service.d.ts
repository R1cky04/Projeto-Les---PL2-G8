import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { PasswordHasherService } from './password-hasher.service';
export declare class InternalUsersService {
    private readonly prisma;
    private readonly passwordHasher;
    constructor(prisma: PrismaService, passwordHasher: PasswordHasherService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
    private ensureUserIdIsUnique;
}
