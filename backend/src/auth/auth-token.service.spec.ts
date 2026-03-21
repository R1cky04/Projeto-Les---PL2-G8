import { AuthTokenService } from './auth-token.service';

// Token service tests focus on the bearer token lifecycle contract.
describe('AuthTokenService', () => {
  const service = new AuthTokenService();

  it('issues tokens that can be parsed and verified', () => {
    const token = service.issueToken();
    const parsedToken = service.parseToken(token.rawToken);

    expect(parsedToken).not.toBeNull();
    expect(parsedToken?.tokenId).toBe(token.tokenId);
    expect(
      service.verifySecret(parsedToken?.secret ?? '', token.tokenHash),
    ).toBe(true);
  });

  it('rejects malformed tokens', () => {
    expect(service.parseToken('invalid-token')).toBeNull();
  });
});
