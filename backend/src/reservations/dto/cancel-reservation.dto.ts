import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelReservationDto {
  @ApiPropertyOptional({
    example: true,
    description:
      'Confirmacao adicional de Admin/IT para cancelamentos com validacao reforcada.',
  })
  @IsOptional()
  @IsBoolean()
  adminValidated?: boolean;
}
