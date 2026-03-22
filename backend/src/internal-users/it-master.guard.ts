import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

// Temporary authorization guard for the sprint auth placeholder.
@Injectable()
export class ItMasterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    // Replace this header lookup with request.user once authentication exists.
    const actorRoleHeader = request.headers['x-actor-role'];
    const actorRole = Array.isArray(actorRoleHeader)
      ? actorRoleHeader[0]
      : actorRoleHeader;

    if (actorRole?.toUpperCase() !== 'IT') {
      throw new ForbiddenException({
        message: 'Apenas o IT pode criar utilizadores internos.',
        code: 'IT_ROLE_REQUIRED',
      });
    }

    return true;
  }
}
