import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import { DeleteInternalUserResponseDto } from './dto/delete-internal-user-response.dto';
import { ListInternalUsersResponseDto } from './dto/list-internal-users-response.dto';
import { UpdateInternalUserDto } from './dto/update-internal-user.dto';
import { UpdateInternalUserResponseDto } from './dto/update-internal-user-response.dto';
import { InternalUsersService } from './internal-users.service';
export declare class InternalUsersController {
    private readonly internalUsersService;
    constructor(internalUsersService: InternalUsersService);
    create(payload: CreateInternalUserDto): Promise<CreateInternalUserResponseDto>;
    findAll(page?: string, pageSize?: string, search?: string): Promise<ListInternalUsersResponseDto>;
    update(id: string, payload: UpdateInternalUserDto, request: AuthenticatedRequest): Promise<UpdateInternalUserResponseDto>;
    remove(id: string, request: AuthenticatedRequest): Promise<DeleteInternalUserResponseDto>;
}
