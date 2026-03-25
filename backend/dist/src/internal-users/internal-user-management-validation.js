"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUpdateInternalUserInput = normalizeUpdateInternalUserInput;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("./internal-user.enums");
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;
function normalizeUpdateInternalUserInput(payload) {
    const errors = [];
    const normalizedUserId = typeof payload?.userId === 'string'
        ? payload.userId.trim().toLowerCase()
        : '';
    const password = parsePassword(payload?.password, errors);
    const role = parseRole(payload?.role);
    const status = parseStatus(payload?.status);
    const isActive = parseIsActive(payload?.isActive);
    if (!normalizedUserId) {
        errors.push({
            field: 'userId',
            message: 'O User ID e obrigatorio.',
        });
    }
    else if (!USER_ID_PATTERN.test(normalizedUserId)) {
        errors.push({
            field: 'userId',
            message: 'O User ID deve ter entre 4 e 30 caracteres e usar apenas letras minusculas, numeros, ponto, underscore ou hifen.',
        });
    }
    if (!role) {
        errors.push({
            field: 'role',
            message: 'Seleciona um tipo de utilizador valido.',
        });
    }
    if (!status) {
        errors.push({
            field: 'status',
            message: 'Seleciona um estado de conta valido.',
        });
    }
    if (typeof isActive !== 'boolean') {
        errors.push({
            field: 'isActive',
            message: 'Indica se a conta deve permanecer ativa.',
        });
    }
    if (errors.length > 0) {
        throw new common_1.BadRequestException({
            message: 'Existem erros de validacao.',
            errors,
        });
    }
    return {
        userId: normalizedUserId,
        password,
        role: role,
        status: status,
        isActive: isActive,
    };
}
function parseRole(role) {
    if (typeof role !== 'string') {
        return null;
    }
    const normalizedRole = role.trim().toUpperCase();
    switch (normalizedRole) {
        case internal_user_enums_1.InternalUserRole.IT:
            return internal_user_enums_1.InternalUserRole.IT;
        case internal_user_enums_1.InternalUserRole.ADMIN:
            return internal_user_enums_1.InternalUserRole.ADMIN;
        case internal_user_enums_1.InternalUserRole.STAFF:
            return internal_user_enums_1.InternalUserRole.STAFF;
        case internal_user_enums_1.InternalUserRole.FLEET:
            return internal_user_enums_1.InternalUserRole.FLEET;
        default:
            return null;
    }
}
function parseStatus(status) {
    if (typeof status !== 'string') {
        return null;
    }
    const normalizedStatus = status.trim().toUpperCase();
    switch (normalizedStatus) {
        case internal_user_enums_1.InternalUserStatus.ACTIVE:
            return internal_user_enums_1.InternalUserStatus.ACTIVE;
        case internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION:
            return internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION;
        default:
            return null;
    }
}
function parsePassword(password, errors) {
    if (typeof password === 'undefined' || password === null) {
        return null;
    }
    if (typeof password !== 'string') {
        errors.push({
            field: 'password',
            message: 'A password indicada e invalida.',
        });
        return null;
    }
    const normalizedPassword = password.trim();
    if (!normalizedPassword) {
        return null;
    }
    if (normalizedPassword.length < 8) {
        errors.push({
            field: 'password',
            message: 'A password deve ter pelo menos 8 caracteres.',
        });
    }
    if (!/[a-z]/.test(normalizedPassword)) {
        errors.push({
            field: 'password',
            message: 'A password deve incluir pelo menos uma letra minuscula.',
        });
    }
    if (!/[A-Z]/.test(normalizedPassword)) {
        errors.push({
            field: 'password',
            message: 'A password deve incluir pelo menos uma letra maiuscula.',
        });
    }
    if (!/[0-9]/.test(normalizedPassword)) {
        errors.push({
            field: 'password',
            message: 'A password deve incluir pelo menos um numero.',
        });
    }
    if (!/[^A-Za-z0-9]/.test(normalizedPassword)) {
        errors.push({
            field: 'password',
            message: 'A password deve incluir pelo menos um caractere especial.',
        });
    }
    return normalizedPassword;
}
function parseIsActive(isActive) {
    return typeof isActive === 'boolean' ? isActive : null;
}
//# sourceMappingURL=internal-user-management-validation.js.map