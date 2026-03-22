"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCreateInternalUserInput = normalizeCreateInternalUserInput;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("./internal-user.enums");
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;
function normalizeCreateInternalUserInput(payload) {
    const errors = [];
    const normalizedUserId = typeof payload?.userId === 'string'
        ? payload.userId.trim().toLowerCase()
        : '';
    const password = typeof payload?.password === 'string' ? payload.password.trim() : '';
    const role = parseRole(payload?.role);
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
    if (!password) {
        errors.push({
            field: 'password',
            message: 'A password e obrigatoria.',
        });
    }
    else {
        if (password.length < 8) {
            errors.push({
                field: 'password',
                message: 'A password deve ter pelo menos 8 caracteres.',
            });
        }
        if (!/[a-z]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'A password deve incluir pelo menos uma letra minuscula.',
            });
        }
        if (!/[A-Z]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'A password deve incluir pelo menos uma letra maiuscula.',
            });
        }
        if (!/[0-9]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'A password deve incluir pelo menos um numero.',
            });
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'A password deve incluir pelo menos um caractere especial.',
            });
        }
    }
    if (!role) {
        errors.push({
            field: 'role',
            message: 'Seleciona um tipo de utilizador valido.',
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
    };
}
function parseRole(role) {
    if (typeof role !== 'string') {
        return null;
    }
    const normalizedRole = role.trim().toUpperCase();
    switch (normalizedRole) {
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
//# sourceMappingURL=internal-user-validation.js.map