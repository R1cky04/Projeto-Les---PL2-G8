"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.VehicleMaintenanceScalarFieldEnum = exports.PaymentScalarFieldEnum = exports.RentalScalarFieldEnum = exports.ReservationScalarFieldEnum = exports.VehicleScalarFieldEnum = exports.LocationScalarFieldEnum = exports.CustomerProfileScalarFieldEnum = exports.TenantUserScalarFieldEnum = exports.UserScalarFieldEnum = exports.TenantScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.4.1",
    engine: "55ae170b1ced7fc6ed07a15f110549408c501bb3"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Tenant: 'Tenant',
    User: 'User',
    TenantUser: 'TenantUser',
    CustomerProfile: 'CustomerProfile',
    Location: 'Location',
    Vehicle: 'Vehicle',
    Reservation: 'Reservation',
    Rental: 'Rental',
    Payment: 'Payment',
    VehicleMaintenance: 'VehicleMaintenance'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.TenantScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    taxNumber: 'taxNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    fullName: 'fullName',
    phone: 'phone',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TenantUserScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CustomerProfileScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    customerType: 'customerType',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    taxNumber: 'taxNumber',
    documentNumber: 'documentNumber',
    driverLicenseNo: 'driverLicenseNo',
    driverLicenseUntil: 'driverLicenseUntil',
    birthDate: 'birthDate',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LocationScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    postalCode: 'postalCode',
    country: 'country',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VehicleScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    plateNumber: 'plateNumber',
    vin: 'vin',
    brand: 'brand',
    model: 'model',
    category: 'category',
    year: 'year',
    seats: 'seats',
    transmission: 'transmission',
    fuelType: 'fuelType',
    odometerKm: 'odometerKm',
    dailyRate: 'dailyRate',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ReservationScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    customerProfileId: 'customerProfileId',
    vehicleId: 'vehicleId',
    pickupLocationId: 'pickupLocationId',
    dropoffLocationId: 'dropoffLocationId',
    pickupAt: 'pickupAt',
    dropoffAt: 'dropoffAt',
    status: 'status',
    quotedTotal: 'quotedTotal',
    notes: 'notes',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RentalScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    reservationId: 'reservationId',
    customerProfileId: 'customerProfileId',
    vehicleId: 'vehicleId',
    pickupAt: 'pickupAt',
    expectedReturnAt: 'expectedReturnAt',
    returnedAt: 'returnedAt',
    pickupOdometerKm: 'pickupOdometerKm',
    returnOdometerKm: 'returnOdometerKm',
    status: 'status',
    totalAmount: 'totalAmount',
    depositAmount: 'depositAmount',
    paymentStatus: 'paymentStatus',
    notes: 'notes',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    rentalId: 'rentalId',
    amount: 'amount',
    method: 'method',
    status: 'status',
    externalRef: 'externalRef',
    paidAt: 'paidAt',
    createdAt: 'createdAt'
};
exports.VehicleMaintenanceScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    vehicleId: 'vehicleId',
    status: 'status',
    description: 'description',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    cost: 'cost',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map