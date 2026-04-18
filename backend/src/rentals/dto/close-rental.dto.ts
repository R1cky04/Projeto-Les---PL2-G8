import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CloseRentalDto {
  @IsInt()
  @Min(0)
  returnOdometerKm: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  actualReturnStationId?: number;

  @IsOptional()
  @IsString()
  finalNotes?: string;
}
