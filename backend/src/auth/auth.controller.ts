import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type {
  AuthenticatedRequest,
  AuthSessionResponseDto,
} from './auth.types';
import { AuthSessionGuard } from './auth-session.guard';

// Thin transport layer for login, session restore and logout.
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autentica um utilizador interno.' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Sessao interna criada com token bearer.',
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais invalidas.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devolve a sessao autenticada atual.' })
  @ApiOkResponse({ description: 'Sessao restaurada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Sessao invalida ou expirada.' })
  getCurrentSession(
    @Req() request: AuthenticatedRequest,
  ): AuthSessionResponseDto {
    return this.authService.getCurrentSession(request.auth!);
  }

  @Post('logout')
  @UseGuards(AuthSessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Termina a sessao autenticada atual.' })
  @ApiCreatedResponse({ description: 'Sessao terminada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Sessao invalida ou expirada.' })
  logout(@Req() request: AuthenticatedRequest): Promise<{ message: string }> {
    return this.authService.logoutCurrentSession(request.auth!);
  }
}
