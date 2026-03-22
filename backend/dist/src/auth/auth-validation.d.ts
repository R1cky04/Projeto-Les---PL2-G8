import { LoginDto } from './dto/login.dto';
export interface NormalizedLoginInput {
    userId: string;
    password: string;
}
export declare function normalizeLoginInput(payload: LoginDto): NormalizedLoginInput;
