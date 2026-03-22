import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InternalUserRole } from './internal-user.enums';
import { AuthenticatedRequest } from '../auth/auth.types';

// Authorization guard for IT-only workflows layered on top of an authenticated
// session resolved by AuthSessionGuard.
@Injectable()
export class ItMasterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorRole = request.auth?.user.role;

    if (actorRole !== InternalUserRole.IT) {
      throw new ForbiddenException({
        message: 'Apenas o IT pode gerir utilizadores internos.',
        code: 'IT_ROLE_REQUIRED',
      });
    }

    return true;
  }
}
