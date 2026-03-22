import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthSessionGuard } from './auth-session.guard';
import { AuthService } from './auth.service';

// Guard tests ensure every protected route sees a resolved authenticated
// session rather than parsing bearer tokens on its own.
describe('AuthSessionGuard', () => {
  let authService: { authenticateSessionToken: jest.Mock };
  let guard: AuthSessionGuard;

  beforeEach(() => {
    authService = {
      authenticateSessionToken: jest.fn(),
    };
    guard = new AuthSessionGuard(authService as unknown as AuthService);
  });

  it('hydrates the request with the authenticated session context', async () => {
    const request = {
      headers: {
        authorization: 'Bearer session-token',
      },
    };
    authService.authenticateSessionToken.mockResolvedValue({
      sessionId: 'session-1',
      tokenId: 'token-1',
      expiresAt: new Date('2026-03-20T12:00:00.000Z'),
      concurrentSessionCount: 0,
      warnings: [],
      user: {
        id: 'user-1',
        userId: 'it.master',
        fullName: 'Master IT',
        role: 'IT',
        status: 'ACTIVE',
        isActive: true,
        accessLevel: 'FULL',
        permissions: [],
      },
      features: [],
    });

    await expect(
      guard.canActivate(createExecutionContext(request)),
    ).resolves.toBe(true);
    expect(request).toHaveProperty('auth.sessionId', 'session-1');
  });

  it('rejects requests without a bearer token', async () => {
    await expect(
      guard.canActivate(createExecutionContext({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

function createExecutionContext(request: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}
