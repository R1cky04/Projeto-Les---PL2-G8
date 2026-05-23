import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
import { ListInternalUsersResponseDto } from './dto/list-internal-users-response.dto';
import { UpdateInternalUserDto } from './dto/update-internal-user.dto';
import { UpdateInternalUserResponseDto } from './dto/update-internal-user-response.dto';
import { InternalUsersService } from './internal-users.service';
import { ItMasterGuard } from './it-master.guard';

// Thin transport layer for IT-only internal user management.
@ApiTags('Internal users')
@ApiBearerAuth()
@Controller('internal-users')
@UseGuards(AuthSessionGuard, ItMasterGuard)
export class InternalUsersController {
  constructor(private readonly internalUsersService: InternalUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um utilizador interno.' })
  @ApiBody({ type: CreateInternalUserDto })
  @ApiCreatedResponse({ description: 'Utilizador criado com sucesso.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir utilizadores.' })
  create(
    @Body() payload: CreateInternalUserDto,
  ): Promise<CreateInternalUserResponseDto> {
    return this.internalUsersService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Lista utilizadores internos com paginacao.' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'pageSize', required: false, example: '10' })
  @ApiQuery({ name: 'search', required: false, example: 'staff' })
  @ApiOkResponse({ description: 'Lista paginada de utilizadores internos.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir utilizadores.' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ): Promise<ListInternalUsersResponseDto> {
    return this.internalUsersService.findAll(page, pageSize, search);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma conta interna existente.' })
  @ApiParam({ name: 'id', example: 'user-id' })
  @ApiBody({ type: UpdateInternalUserDto })
  @ApiOkResponse({ description: 'Resultado da atualizacao da conta.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir utilizadores.' })
  @ApiNotFoundResponse({ description: 'Utilizador interno nao encontrado.' })
  update(
    @Param('id') id: string,
    @Body() payload: UpdateInternalUserDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UpdateInternalUserResponseDto> {
    return this.internalUsersService.update(id, payload, request.auth!.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove ou desativa um utilizador interno.' })
  @ApiParam({ name: 'id', example: 'user-id' })
  @ApiOkResponse({ description: 'Conta removida ou desativada.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir utilizadores.' })
  @ApiNotFoundResponse({ description: 'Utilizador interno nao encontrado.' })
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<DeleteInternalUserResponseDto> {
    return this.internalUsersService.remove(id, request.auth!.user);
  }
}
