import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './auth.types';

// Guard that resolves the bearer token into a trusted authenticated session.
@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorizationHeader = request.headers.authorization;
    const token = this.extractBearerToken(authorizationHeader);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Sessao em falta ou invalida.',
        code: 'SESSION_REQUIRED',
      });
    }

    request.auth = await this.authService.authenticateSessionToken(token);
    return true;
  }

  private extractBearerToken(
    authorizationHeader: string | string[] | undefined,
  ): string | null {
    const normalizedHeader = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    if (!normalizedHeader) {
      return null;
    }

    const [scheme, credentials] = normalizedHeader.split(' ');

    return scheme === 'Bearer' && credentials ? credentials : null;
  }
}
