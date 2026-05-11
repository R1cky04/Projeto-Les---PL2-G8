import { ApiProperty } from '@nestjs/swagger';

// Transport contract for internal login requests.
export class LoginDto {
  @ApiProperty({
    example: 'it.master',
    description: 'Identificador interno usado no login.',
  })
  userId!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password do utilizador interno.',
    format: 'password',
  })
  password!: string;
}

export interface LoginFieldValidationError {
  field: keyof LoginDto;
  message: string;
}
