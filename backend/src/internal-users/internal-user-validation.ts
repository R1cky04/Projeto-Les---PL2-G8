import { BadRequestException } from '@nestjs/common';
import { InternalUserRole } from './internal-user.enums';
import {
  CreateInternalUserDto,
  FieldValidationError,
} from './dto/create-internal-user.dto';

// Input normalization and validation for internal user creation.
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;

export interface NormalizedCreateInternalUserInput {
  userId: string;
  password: string;
  role: InternalUserRole;
}

export function normalizeCreateInternalUserInput(
  payload: CreateInternalUserDto,
): NormalizedCreateInternalUserInput {
  const errors: FieldValidationError[] = [];

  // Normalize first so every downstream rule operates on a stable shape.
  const normalizedUserId =
    typeof payload?.userId === 'string'
      ? payload.userId.trim().toLowerCase()
      : '';
  const password =
    typeof payload?.password === 'string' ? payload.password.trim() : '';
  const role = parseRole(payload?.role);

  if (!normalizedUserId) {
    errors.push({
      field: 'userId',
      message: 'O User ID e obrigatorio.',
    });
  } else if (!USER_ID_PATTERN.test(normalizedUserId)) {
    errors.push({
      field: 'userId',
      message:
        'O User ID deve ter entre 4 e 30 caracteres e usar apenas letras minusculas, numeros, ponto, underscore ou hifen.',
    });
  }

  if (!password) {
    errors.push({
      field: 'password',
      message: 'A password e obrigatoria.',
    });
  } else {
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
    throw new BadRequestException({
      message: 'Existem erros de validacao.',
      errors,
    });
  }

  return {
    userId: normalizedUserId,
    password,
    role: role as InternalUserRole,
  };
}

function parseRole(role: unknown): InternalUserRole | null {
  // Accept transport strings and map them to the persisted enum values.
  if (typeof role !== 'string') {
    return null;
  }

  const normalizedRole = role.trim().toUpperCase();

  switch (normalizedRole) {
    case InternalUserRole.ADMIN:
      return InternalUserRole.ADMIN;
    case InternalUserRole.STAFF:
      return InternalUserRole.STAFF;
    case InternalUserRole.FLEET:
      return InternalUserRole.FLEET;
    default:
      return null;
  }
}
