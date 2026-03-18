import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ItMasterGuard } from './it-master.guard';

describe('ItMasterGuard', () => {
  const guard = new ItMasterGuard();

  it('allows requests flagged as IT', () => {
    const context = createExecutionContext('IT');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects requests without IT role', () => {
    const context = createExecutionContext('STAFF');

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

function createExecutionContext(role: string | undefined): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          'x-actor-role': role,
        },
      }),
    }),
  } as ExecutionContext;
}
