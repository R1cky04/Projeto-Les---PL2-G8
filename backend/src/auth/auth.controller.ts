import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type {
  AuthenticatedRequest,
  AuthSessionResponseDto,
} from './auth.types';
import { AuthSessionGuard } from './auth-session.guard';

// Thin transport layer for login, session restore and logout.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() payload: LoginDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<AuthSessionResponseDto> {
    const userAgentHeader = request.headers['user-agent'];
    const userAgent = Array.isArray(userAgentHeader)
      ? userAgentHeader[0]
      : userAgentHeader;

    return this.authService.login(payload, userAgent);
  }

  @Get('me')
  @UseGuards(AuthSessionGuard)
  getCurrentSession(
    @Req() request: AuthenticatedRequest,
  ): AuthSessionResponseDto {
    return this.authService.getCurrentSession(request.auth!);
  }

  @Post('logout')
  @UseGuards(AuthSessionGuard)
  logout(@Req() request: AuthenticatedRequest): Promise<{ message: string }> {
    return this.authService.logoutCurrentSession(request.auth!);
  }
}
