import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { InternalUsersService } from './internal-users.service';
export declare class InternalUsersController {
    private readonly internalUsersService;
    constructor(internalUsersService: InternalUsersService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
}
