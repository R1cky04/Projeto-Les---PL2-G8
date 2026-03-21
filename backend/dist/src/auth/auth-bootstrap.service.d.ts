import { OnApplicationBootstrap } from '@nestjs/common';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthBootstrapService implements OnApplicationBootstrap {
    private readonly prisma;
    private readonly passwordHasher;
    constructor(prisma: PrismaService, passwordHasher: PasswordHasherService);
    onApplicationBootstrap(): Promise<void>;
    private shouldBootstrapMasterIt;
}
