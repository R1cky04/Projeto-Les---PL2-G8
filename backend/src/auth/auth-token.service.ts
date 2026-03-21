import { Injectable } from '@nestjs/common';
import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

interface IssuedSessionToken {
  rawToken: string;
  tokenId: string;
  tokenHash: string;
}

interface ParsedSessionToken {
  tokenId: string;
  secret: string;
}

// Session tokens are opaque bearer credentials. Only a derived hash is stored
// in the database so leaked session rows cannot be replayed directly.
@Injectable()
export class AuthTokenService {
  issueToken(): IssuedSessionToken {
    const tokenId = randomUUID();
    const secret = randomBytes(32).toString('base64url');

    return {
      rawToken: `${tokenId}.${secret}`,
      tokenId,
      tokenHash: this.hashSecret(secret),
    };
  }

  parseToken(rawToken: string): ParsedSessionToken | null {
    if (typeof rawToken !== 'string' || rawToken.length === 0) {
      return null;
    }

    const [tokenId, secret] = rawToken.split('.');

    if (!tokenId || !secret) {
      return null;
    }

    return { tokenId, secret };
  }

  verifySecret(secret: string, expectedHash: string): boolean {
    const derivedHash = this.hashSecret(secret);
    const derivedBuffer = Buffer.from(derivedHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (derivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(derivedBuffer, expectedBuffer);
  }

  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }
}
