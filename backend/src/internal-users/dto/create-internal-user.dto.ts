export class CreateInternalUserDto {
  userId!: string;
  password!: string;
  role!: string;
}

export interface FieldValidationError {
  field: keyof CreateInternalUserDto;
  message: string;
}
