import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InternalUserRole } from './internal-user.enums';
import { ItMasterGuard } from './it-master.guard';

// Guard tests for the IT-only authorization rule after authentication.
describe('ItMasterGuard', () => {
  const guard = new ItMasterGuard();

  it('allows requests flagged as IT', () => {
    const context = createExecutionContext(InternalUserRole.IT);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects requests without IT role', () => {
    const context = createExecutionContext(InternalUserRole.STAFF);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

function createExecutionContext(
  role: InternalUserRole | undefined,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        auth: {
          user: {
            role,
          },
        },
      }),
    }),
  } as ExecutionContext;
}
