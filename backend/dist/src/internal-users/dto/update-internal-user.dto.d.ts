export declare class UpdateInternalUserDto {
    userId: string;
    password?: string;
    role: string;
    status: string;
    isActive: boolean;
}
export interface UpdateInternalUserFieldValidationError {
    field: keyof UpdateInternalUserDto;
    message: string;
}
