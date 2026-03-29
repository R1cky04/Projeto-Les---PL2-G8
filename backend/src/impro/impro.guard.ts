import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InternalUserRole } from '../internal-users/internal-user.enums';
import type { AuthenticatedRequest } from '../auth/auth.types';

@Injectable()
export class ImproGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorRole = request.auth?.user.role;

    if (
      actorRole !== InternalUserRole.FLEET &&
      actorRole !== InternalUserRole.ADMIN &&
      actorRole !== InternalUserRole.IT
    ) {
      throw new ForbiddenException({
        message: 'Apenas Frota, Admin ou IT podem gerir impros.',
        code: 'IMPRO_ROLE_REQUIRED',
      });
    }

    return true;
  }
}
