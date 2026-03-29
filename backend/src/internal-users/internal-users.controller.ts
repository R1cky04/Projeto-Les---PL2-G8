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
@Controller('internal-users')
@UseGuards(AuthSessionGuard, ItMasterGuard)
export class InternalUsersController {
  constructor(private readonly internalUsersService: InternalUsersService) {}

  @Post()
  create(
    @Body() payload: CreateInternalUserDto,
  ): Promise<CreateInternalUserResponseDto> {
    return this.internalUsersService.create(payload);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ): Promise<ListInternalUsersResponseDto> {
    return this.internalUsersService.findAll(page, pageSize, search);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateInternalUserDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UpdateInternalUserResponseDto> {
    return this.internalUsersService.update(id, payload, request.auth!.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<DeleteInternalUserResponseDto> {
    return this.internalUsersService.remove(id, request.auth!.user);
  }
}
