"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsForRole = getPermissionsForRole;
exports.requiresItValidation = requiresItValidation;
exports.getInitialStatusForRole = getInitialStatusForRole;
const client_1 = require("@prisma/client");
const ROLE_PERMISSIONS = {
    [client_1.InternalUserRole.STAFF]: [
        client_1.InternalPermission.RESERVATION_READ,
        client_1.InternalPermission.RENTAL_READ,
    ],
    [client_1.InternalUserRole.FLEET]: [
        client_1.InternalPermission.RESERVATION_READ,
        client_1.InternalPermission.RENTAL_READ,
        client_1.InternalPermission.VEHICLE_READ,
        client_1.InternalPermission.VEHICLE_WRITE,
        client_1.InternalPermission.MAINTENANCE_WRITE,
        client_1.InternalPermission.TRANSFER_WRITE,
        client_1.InternalPermission.INCIDENT_WRITE,
    ],
    [client_1.InternalUserRole.ADMIN]: [
        client_1.InternalPermission.RESERVATION_READ,
        client_1.InternalPermission.RENTAL_READ,
        client_1.InternalPermission.VEHICLE_READ,
        client_1.InternalPermission.VEHICLE_WRITE,
        client_1.InternalPermission.MAINTENANCE_WRITE,
        client_1.InternalPermission.TRANSFER_WRITE,
        client_1.InternalPermission.INCIDENT_WRITE,
        client_1.InternalPermission.USER_READ,
        client_1.InternalPermission.USER_CREATE,
        client_1.InternalPermission.USER_ACTIVATE,
    ],
};
const RESTRICTED_ROLES = new Set([
    client_1.InternalUserRole.STAFF,
    client_1.InternalUserRole.FLEET,
]);
function getPermissionsForRole(role) {
    return [...ROLE_PERMISSIONS[role]];
}
function requiresItValidation(role) {
    return RESTRICTED_ROLES.has(role);
}
function getInitialStatusForRole(role) {
    return requiresItValidation(role)
        ? client_1.InternalUserStatus.PENDING_IT_VALIDATION
        : client_1.InternalUserStatus.ACTIVE;
}
//# sourceMappingURL=internal-user-access.js.map