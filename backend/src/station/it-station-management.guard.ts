import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InternalUserRole } from '../internal-users/internal-user.enums';
import type { AuthenticatedRequest } from '../auth/auth.types';

// IT-only guard for station management endpoints.
@Injectable()
export class ItStationManagementGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorRole = request.auth?.user.role;

    if (actorRole !== InternalUserRole.IT) {
      throw new ForbiddenException({
        message: 'Apenas o IT pode gerir estacoes.',
        code: 'IT_ROLE_REQUIRED',
      });
    }

    return true;
  }
}
