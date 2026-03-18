import { Module } from '@nestjs/common';
import { InternalUsersController } from './internal-users.controller';
import { InternalUsersService } from './internal-users.service';
import { ItMasterGuard } from './it-master.guard';
import { PasswordHasherService } from './password-hasher.service';

@Module({
  controllers: [InternalUsersController],
  providers: [InternalUsersService, PasswordHasherService, ItMasterGuard],
})
export class InternalUsersModule {}
