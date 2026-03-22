import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InternalUsersController } from './internal-users.controller';
import { InternalUsersService } from './internal-users.service';
import { ItMasterGuard } from './it-master.guard';
import { PasswordHasherService } from './password-hasher.service';

// Feature module for internal user management.
@Module({
  imports: [AuthModule],
  controllers: [InternalUsersController],
  providers: [InternalUsersService, PasswordHasherService, ItMasterGuard],
})
export class InternalUsersModule {}
