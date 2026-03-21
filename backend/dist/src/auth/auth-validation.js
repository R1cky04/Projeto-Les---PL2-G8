"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLoginInput = normalizeLoginInput;
const common_1 = require("@nestjs/common");
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;
function normalizeLoginInput(payload) {
    const errors = [];
    const normalizedUserId = typeof payload?.userId === 'string'
        ? payload.userId.trim().toLowerCase()
        : '';
    const password = typeof payload?.password === 'string' ? payload.password.trim() : '';
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
    if (errors.length > 0) {
        throw new common_1.BadRequestException({
            message: 'Existem erros de validacao no login.',
            errors,
        });
    }
    return {
        userId: normalizedUserId,
        password,
    };
}
//# sourceMappingURL=auth-validation.js.map