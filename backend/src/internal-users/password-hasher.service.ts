import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordHasherService {
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

    const derivedKey = scryptSync(password, salt, 64);
    const storedKey = Buffer.from(storedHash, 'hex');

    return timingSafeEqual(derivedKey, storedKey);
  }
}
