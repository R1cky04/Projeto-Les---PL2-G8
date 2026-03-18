export declare class PasswordHasherService {
    hash(password: string): string;
    verify(password: string, passwordHash: string): boolean;
}
