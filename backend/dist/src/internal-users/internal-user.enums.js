"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalPermission = exports.InternalUserStatus = exports.InternalUserRole = void 0;
var InternalUserRole;
(function (InternalUserRole) {
    InternalUserRole["IT"] = "IT";
    InternalUserRole["ADMIN"] = "ADMIN";
    InternalUserRole["STAFF"] = "STAFF";
    InternalUserRole["FLEET"] = "FLEET";
})(InternalUserRole || (exports.InternalUserRole = InternalUserRole = {}));
var InternalUserStatus;
(function (InternalUserStatus) {
    InternalUserStatus["ACTIVE"] = "ACTIVE";
    InternalUserStatus["PENDING_IT_VALIDATION"] = "PENDING_IT_VALIDATION";
})(InternalUserStatus || (exports.InternalUserStatus = InternalUserStatus = {}));
var InternalPermission;
(function (InternalPermission) {
    InternalPermission["RESERVATION_READ"] = "RESERVATION_READ";
    InternalPermission["RENTAL_READ"] = "RENTAL_READ";
    InternalPermission["VEHICLE_READ"] = "VEHICLE_READ";
    InternalPermission["VEHICLE_WRITE"] = "VEHICLE_WRITE";
    InternalPermission["MAINTENANCE_WRITE"] = "MAINTENANCE_WRITE";
    InternalPermission["TRANSFER_WRITE"] = "TRANSFER_WRITE";
    InternalPermission["INCIDENT_WRITE"] = "INCIDENT_WRITE";
    InternalPermission["USER_READ"] = "USER_READ";
    InternalPermission["USER_CREATE"] = "USER_CREATE";
    InternalPermission["USER_ACTIVATE"] = "USER_ACTIVATE";
})(InternalPermission || (exports.InternalPermission = InternalPermission = {}));
//# sourceMappingURL=internal-user.enums.js.map