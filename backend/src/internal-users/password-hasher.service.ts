import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordHasherService {
  // Stored as algorithm$salt$hash to keep the hash self-describing.
  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64).toString('hex');

    return `scrypt$${salt}$${derivedKey}`;
  }

  verify(password: string, passwordHash: string): boolean {
    const [algorithm, salt, storedHash] = passwordHash.split('$');

    if (algorithm !== 'scrypt' || !salt || !storedHash) {
      return false;
    }

    // Compare in constant time once both buffers have been derived.
    const derivedKey = scryptSync(password, salt, 64);
    const storedKey = Buffer.from(storedHash, 'hex');

    return timingSafeEqual(derivedKey, storedKey);
  }
}
