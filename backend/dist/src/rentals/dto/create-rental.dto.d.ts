export declare class CreateRentalDto {
    stationId: number;
    vehicleId: number;
    pickupAt: string;
    expectedReturnAt: string;
    pickupOdometerKm: number;
    vehicleCondition: string;
    notes?: string;
    customerId?: number;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerDocumentNumber?: string;
}
