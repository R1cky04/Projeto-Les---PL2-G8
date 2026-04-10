import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalService, type RentalRecord, type RentalContextResponse } from './rental.service';
export declare class RentalController {
    private readonly rentalService;
    constructor(rentalService: RentalService);
    getContext(): Promise<RentalContextResponse>;
    findAll(): Promise<RentalRecord[]>;
    create(createRentalDto: CreateRentalDto, request: AuthenticatedRequest): Promise<RentalRecord>;
}
