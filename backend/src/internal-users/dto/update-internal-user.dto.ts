// Request contract for PUT /internal-users/:id.
export class UpdateInternalUserDto {
  userId!: string;
  password?: string;
  role!: string;
  status!: string;
  isActive!: boolean;
}

// Field-level validation errors returned to the client.
export interface UpdateInternalUserFieldValidationError {
  field: keyof UpdateInternalUserDto;
  message: string;
}
