import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InternalUserRole, InternalUserStatus } from '../internal-user.enums';

// Request contract for PUT /internal-users/:id.
export class UpdateInternalUserDto {
  @ApiProperty({
    example: 'staff.lisboa',
    description: 'Novo identificador interno para login.',
  })
  userId!: string;

  @ApiPropertyOptional({
    example: 'NewStrongPass123',
    description: 'Nova password, quando for necessario alterar credenciais.',
    format: 'password',
  })
  password?: string;

  @ApiProperty({
    enum: InternalUserRole,
    example: InternalUserRole.ADMIN,
    description: 'Perfil operacional atualizado.',
  })
  role!: string;

  @ApiProperty({
    enum: InternalUserStatus,
    example: InternalUserStatus.ACTIVE,
    description: 'Estado de validacao e acesso da conta.',
  })
  status!: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a conta continua ativa.',
  })
  isActive!: boolean;
}

// Field-level validation errors returned to the client.
export interface UpdateInternalUserFieldValidationError {
  field: keyof UpdateInternalUserDto;
  message: string;
}
