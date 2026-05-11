import { ApiProperty } from '@nestjs/swagger';
import { InternalUserRole } from '../internal-user.enums';

// Request contract for POST /internal-users.
export class CreateInternalUserDto {
  @ApiProperty({
    example: 'staff.lisboa',
    description: 'Identificador interno unico para login.',
  })
  userId!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Password inicial da conta interna.',
    format: 'password',
  })
  password!: string;

  @ApiProperty({
    enum: InternalUserRole,
    example: InternalUserRole.STAFF,
    description: 'Perfil operacional atribuido ao utilizador.',
  })
  role!: string;
}

// Field-level validation errors returned to the client.
export interface FieldValidationError {
  field: keyof CreateInternalUserDto;
  message: string;
}
