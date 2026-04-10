import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { VehicleService, type Vehicle } from '../vehicle/vehicle.service';
import { CreateRentalDto } from './dto/create-rental.dto';
export interface RentalCustomer {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    documentNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface RentalRecord {
    id: number;
    contractNumber: string;
    customerId: number;
    customerFullName: string;
    customerEmail: string | null;
    vehicleId: number;
    vehiclePlate: string;
    vehicleBrand: string;
    vehicleModel: string;
    stationId: number;
    stationName: string;
    pickupAt: Date;
    expectedReturnAt: Date;
    pickupOdometerKm: number;
    estimatedDays: number;
    estimatedAmount: number;
    vehicleCondition: string;
    status: 'OPEN' | 'CLOSED' | 'CANCELLED';
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface RentalContextResponse {
    customers: RentalCustomer[];
    stations: Awaited<ReturnType<StationService['findAll']>>;
    availableVehicles: (Vehicle & {
        stationName: string;
    })[];
    recentRentals: RentalRecord[];
}
export declare class RentalService {
    private readonly stationService;
    private readonly vehicleService;
    private customers;
    private rentals;
    private nextCustomerId;
    private nextRentalId;
    constructor(stationService: StationService, vehicleService: VehicleService);
    getContext(): Promise<RentalContextResponse>;
    findAll(): Promise<RentalRecord[]>;
    listAvailableVehicles(stationId?: number): Promise<Vehicle[]>;
    create(payload: CreateRentalDto, actor?: AuthenticatedUserDto): Promise<RentalRecord>;
    private resolveCustomer;
    private calculateRentalDays;
    private parseDate;
    private buildContractNumber;
    private buildCustomerName;
    private resolveActorLabel;
}
