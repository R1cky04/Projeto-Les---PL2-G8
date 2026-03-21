export declare class LoginDto {
    userId: string;
    password: string;
}
export interface LoginFieldValidationError {
    field: keyof LoginDto;
    message: string;
}
