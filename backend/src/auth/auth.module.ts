import { Module } from '@nestjs/common';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { AuthBootstrapService } from './auth-bootstrap.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSessionGuard } from './auth-session.guard';
import { AuthTokenService } from './auth-token.service';

// Authentication wiring for internal login and session lifecycle concerns.
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionGuard,
    AuthTokenService,
    AuthBootstrapService,
    PasswordHasherService,
  ],
  exports: [AuthService, AuthSessionGuard],
})
export class AuthModule {}
