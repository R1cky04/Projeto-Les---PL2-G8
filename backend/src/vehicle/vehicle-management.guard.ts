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

const IT_ONLY_METHODS = new Set(['POST', 'DELETE']);

@Injectable()
export class VehicleManagementGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorRole = request.auth?.user.role;
    const method = request.method.toUpperCase();

    if (!actorRole || !MANAGE_ROLES.has(actorRole)) {
      throw new ForbiddenException({
        message:
          'Apenas perfis IT, ADMIN, STAFF e FLEET podem gerir o modulo de veiculos.',
        code: 'VEHICLE_MANAGEMENT_ROLE_REQUIRED',
      });
    }

    if (IT_ONLY_METHODS.has(method) && actorRole !== InternalUserRole.IT) {
      throw new ForbiddenException({
        message: 'Apenas o perfil IT pode criar ou eliminar veiculos.',
        code: 'VEHICLE_CREATE_DELETE_IT_ONLY',
      });
    }

    return true;
  }
}