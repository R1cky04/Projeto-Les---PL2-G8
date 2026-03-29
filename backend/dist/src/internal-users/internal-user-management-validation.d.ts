import { InternalUserRole, InternalUserStatus } from './internal-user.enums';
import { UpdateInternalUserDto } from './dto/update-internal-user.dto';
export interface NormalizedUpdateInternalUserInput {
    userId: string;
    password: string | null;
    role: InternalUserRole;
    status: InternalUserStatus;
    isActive: boolean;
}
export declare function normalizeUpdateInternalUserInput(payload: UpdateInternalUserDto): NormalizedUpdateInternalUserInput;
