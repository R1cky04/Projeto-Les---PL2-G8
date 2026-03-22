import { InternalUserRole } from './internal-user.enums';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
export interface NormalizedCreateInternalUserInput {
    userId: string;
    password: string;
    role: InternalUserRole;
}
export declare function normalizeCreateInternalUserInput(payload: CreateInternalUserDto): NormalizedCreateInternalUserInput;
