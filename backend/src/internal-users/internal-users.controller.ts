import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { InternalUsersService } from './internal-users.service';
import { ItMasterGuard } from './it-master.guard';

// Thin transport layer for internal user creation.
@Controller('internal-users')
@UseGuards(ItMasterGuard)
export class InternalUsersController {
  constructor(private readonly internalUsersService: InternalUsersService) {}

  @Post()
  create(
    @Body() payload: CreateInternalUserDto,
  ): Promise<CreateInternalUserResponseDto> {
    return this.internalUsersService.create(payload);
  }
}
