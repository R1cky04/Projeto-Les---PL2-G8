import { PrismaService } from '../prisma/prisma.service';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { AuthenticatedSessionContext, AuthSessionResponseDto } from './auth.types';
import { AuthTokenService } from './auth-token.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly passwordHasher;
    private readonly authTokenService;
    constructor(prisma: PrismaService, passwordHasher: PasswordHasherService, authTokenService: AuthTokenService);
    login(payload: LoginDto, userAgent?: string): Promise<AuthSessionResponseDto>;
    authenticateSessionToken(rawToken: string): Promise<AuthenticatedSessionContext>;
    getCurrentSession(context: AuthenticatedSessionContext): AuthSessionResponseDto;
    logoutCurrentSession(context: AuthenticatedSessionContext): Promise<{
        message: string;
    }>;
    private buildAuthenticatedContext;
    private toResponse;
    private buildWarnings;
    private countActiveSessions;
    private getAccessLevel;
    private getLoginSuccessMessage;
    private createInvalidCredentialsException;
    private createSessionExpiry;
}
