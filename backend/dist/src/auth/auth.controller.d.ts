import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest, AuthSessionResponseDto } from './auth.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(payload: LoginDto, request: AuthenticatedRequest): Promise<AuthSessionResponseDto>;
    getCurrentSession(request: AuthenticatedRequest): AuthSessionResponseDto;
    logout(request: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
