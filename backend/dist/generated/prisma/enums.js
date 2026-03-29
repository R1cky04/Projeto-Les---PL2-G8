"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceStatus = exports.PaymentMethod = exports.PaymentStatus = exports.RentalStatus = exports.ReservationStatus = exports.FuelType = exports.TransmissionType = exports.VehicleStatus = exports.CustomerType = exports.TenantUserRole = void 0;
exports.TenantUserRole = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    DEV: 'DEV'
};
exports.CustomerType = {
    REGISTERED: 'REGISTERED',
    NO_LOGIN: 'NO_LOGIN'
};
exports.VehicleStatus = {
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    RENTED: 'RENTED',
    MAINTENANCE: 'MAINTENANCE',
    INACTIVE: 'INACTIVE'
};
exports.TransmissionType = {
    MANUAL: 'MANUAL',
    AUTOMATIC: 'AUTOMATIC'
};
exports.FuelType = {
    GASOLINE: 'GASOLINE',
    DIESEL: 'DIESEL',
    ELECTRIC: 'ELECTRIC',
    HYBRID: 'HYBRID'
};
exports.ReservationStatus = {
    DRAFT: 'DRAFT',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
    NO_SHOW: 'NO_SHOW'
};
exports.RentalStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    CANCELLED: 'CANCELLED'
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
    REFUNDED: 'REFUNDED',
    FAILED: 'FAILED'
};
exports.PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    TRANSFER: 'TRANSFER',
    MBWAY: 'MBWAY'
};
exports.MaintenanceStatus = {
    SCHEDULED: 'SCHEDULED',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELLED: 'CANCELLED'
};
//# sourceMappingURL=enums.js.map