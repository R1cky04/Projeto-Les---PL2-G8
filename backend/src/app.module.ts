import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InternalUsersModule } from './internal-users/internal-users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImproModule } from './impro/impro.module';
import { StationModule } from './station/station.module';

// Root module wiring shared infrastructure and feature modules.
@Module({
  imports: [PrismaModule, AuthModule, StationModule, InternalUsersModule, ImproModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
