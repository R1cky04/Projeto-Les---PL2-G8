export declare const TenantUserRole: {
    readonly ADMIN: "ADMIN";
    readonly STAFF: "STAFF";
    readonly DEV: "DEV";
};
export type TenantUserRole = (typeof TenantUserRole)[keyof typeof TenantUserRole];
export declare const CustomerType: {
    readonly REGISTERED: "REGISTERED";
    readonly NO_LOGIN: "NO_LOGIN";
};
export type CustomerType = (typeof CustomerType)[keyof typeof CustomerType];
export declare const VehicleStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly RESERVED: "RESERVED";
    readonly RENTED: "RENTED";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly INACTIVE: "INACTIVE";
};
export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus];
export declare const TransmissionType: {
    readonly MANUAL: "MANUAL";
    readonly AUTOMATIC: "AUTOMATIC";
};
export type TransmissionType = (typeof TransmissionType)[keyof typeof TransmissionType];
export declare const FuelType: {
    readonly GASOLINE: "GASOLINE";
    readonly DIESEL: "DIESEL";
    readonly ELECTRIC: "ELECTRIC";
    readonly HYBRID: "HYBRID";
};
export type FuelType = (typeof FuelType)[keyof typeof FuelType];
export declare const ReservationStatus: {
    readonly DRAFT: "DRAFT";
    readonly CONFIRMED: "CONFIRMED";
    readonly CANCELLED: "CANCELLED";
    readonly COMPLETED: "COMPLETED";
    readonly NO_SHOW: "NO_SHOW";
};
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];
export declare const RentalStatus: {
    readonly OPEN: "OPEN";
    readonly CLOSED: "CLOSED";
    readonly CANCELLED: "CANCELLED";
};
export type RentalStatus = (typeof RentalStatus)[keyof typeof RentalStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED";
    readonly REFUNDED: "REFUNDED";
    readonly FAILED: "FAILED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly TRANSFER: "TRANSFER";
    readonly MBWAY: "MBWAY";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const MaintenanceStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DONE: "DONE";
    readonly CANCELLED: "CANCELLED";
};
export type MaintenanceStatus = (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus];
