interface IssuedSessionToken {
    rawToken: string;
    tokenId: string;
    tokenHash: string;
}
interface ParsedSessionToken {
    tokenId: string;
    secret: string;
}
export declare class AuthTokenService {
    issueToken(): IssuedSessionToken;
    parseToken(rawToken: string): ParsedSessionToken | null;
    verifySecret(secret: string, expectedHash: string): boolean;
    private hashSecret;
}
export {};
