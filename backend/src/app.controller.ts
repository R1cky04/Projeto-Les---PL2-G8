import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verifica se a API esta acessivel.' })
  @ApiOkResponse({ description: 'API disponivel.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
