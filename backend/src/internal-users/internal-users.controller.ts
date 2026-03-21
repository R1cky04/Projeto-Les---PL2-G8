import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
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
  findAll() {
    return this.internalUsersService.findAll();
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<DeleteInternalUserResponseDto> {
    return this.internalUsersService.remove(id, request.auth!.user);
  }
}
