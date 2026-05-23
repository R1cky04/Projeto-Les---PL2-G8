import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('makes')
  async makes(@Query('q') q?: string, @Query('limit') limit?: string) {
    return this.catalog.listMakes(q, limit ? Number(limit) : undefined);
  }

  @Get('models')
  async models(
    @Query('makeId') makeId?: string,
    @Query('q') q?: string,
    @Query('year') year?: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalog.listModels(
      makeId,
      q,
      year ? Number(year) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('variants')
  async variants(@Query('modelId') modelId?: string, @Query('q') q?: string, @Query('limit') limit?: string) {
    if (!modelId) return [];
    return this.catalog.listVariants(modelId, q, limit ? Number(limit) : undefined);
  }

  @Post('vin/lookup')
  async vinLookup(@Body() body: { vin?: string }) {
    return this.catalog.vinLookup(body.vin || '');
  }
}
