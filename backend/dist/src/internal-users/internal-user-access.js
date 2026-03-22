"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsForRole = getPermissionsForRole;
exports.requiresItValidation = requiresItValidation;
exports.getInitialStatusForRole = getInitialStatusForRole;
const internal_user_enums_1 = require("./internal-user.enums");
const ROLE_PERMISSIONS = {
    [internal_user_enums_1.InternalUserRole.IT]: [
        internal_user_enums_1.InternalPermission.RESERVATION_READ,
        internal_user_enums_1.InternalPermission.RENTAL_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_WRITE,
        internal_user_enums_1.InternalPermission.MAINTENANCE_WRITE,
        internal_user_enums_1.InternalPermission.TRANSFER_WRITE,
        internal_user_enums_1.InternalPermission.INCIDENT_WRITE,
        internal_user_enums_1.InternalPermission.USER_READ,
        internal_user_enums_1.InternalPermission.USER_CREATE,
        internal_user_enums_1.InternalPermission.USER_ACTIVATE,
    ],
    [internal_user_enums_1.InternalUserRole.STAFF]: [
        internal_user_enums_1.InternalPermission.RESERVATION_READ,
        internal_user_enums_1.InternalPermission.RENTAL_READ,
    ],
    [internal_user_enums_1.InternalUserRole.FLEET]: [
        internal_user_enums_1.InternalPermission.RESERVATION_READ,
        internal_user_enums_1.InternalPermission.RENTAL_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_WRITE,
        internal_user_enums_1.InternalPermission.MAINTENANCE_WRITE,
        internal_user_enums_1.InternalPermission.TRANSFER_WRITE,
        internal_user_enums_1.InternalPermission.INCIDENT_WRITE,
    ],
    [internal_user_enums_1.InternalUserRole.ADMIN]: [
        internal_user_enums_1.InternalPermission.RESERVATION_READ,
        internal_user_enums_1.InternalPermission.RENTAL_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_READ,
        internal_user_enums_1.InternalPermission.VEHICLE_WRITE,
        internal_user_enums_1.InternalPermission.MAINTENANCE_WRITE,
        internal_user_enums_1.InternalPermission.TRANSFER_WRITE,
        internal_user_enums_1.InternalPermission.INCIDENT_WRITE,
        internal_user_enums_1.InternalPermission.USER_READ,
        internal_user_enums_1.InternalPermission.USER_CREATE,
        internal_user_enums_1.InternalPermission.USER_ACTIVATE,
    ],
};
const RESTRICTED_ROLES = new Set([
    internal_user_enums_1.InternalUserRole.STAFF,
    internal_user_enums_1.InternalUserRole.FLEET,
]);
function getPermissionsForRole(role) {
    return [...ROLE_PERMISSIONS[role]];
}
function requiresItValidation(role) {
    return RESTRICTED_ROLES.has(role);
}
function getInitialStatusForRole(role) {
    return requiresItValidation(role)
        ? internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION
        : internal_user_enums_1.InternalUserStatus.ACTIVE;
}
//# sourceMappingURL=internal-user-access.js.map