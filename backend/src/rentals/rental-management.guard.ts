import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InternalUserRole } from '../internal-users/internal-user.enums';
import type { AuthenticatedRequest } from '../auth/auth.types';

const MANAGE_ROLES = new Set<InternalUserRole>([
  InternalUserRole.IT,
  InternalUserRole.ADMIN,
  InternalUserRole.STAFF,
  InternalUserRole.FLEET,
]);

@Injectable()
export class RentalManagementGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorRole = request.auth?.user.role;

    if (!actorRole || !MANAGE_ROLES.has(actorRole)) {
      throw new ForbiddenException({
        message: 'Apenas perfis IT, ADMIN, STAFF e FLEET podem gerir contratos.',
        code: 'RENTAL_MANAGEMENT_ROLE_REQUIRED',
      });
    }

    return true;
  }
}