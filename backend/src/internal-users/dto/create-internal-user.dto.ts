// Request contract for POST /internal-users.
export class CreateInternalUserDto {
  userId!: string;
  password!: string;
  role!: string;
}

// Field-level validation errors returned to the client.
export interface FieldValidationError {
  field: keyof CreateInternalUserDto;
  message: string;
}
