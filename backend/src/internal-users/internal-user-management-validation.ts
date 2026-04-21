import { BadRequestException } from '@nestjs/common';
import { InternalUserRole, InternalUserStatus } from './internal-user.enums';
import {
  UpdateInternalUserDto,
  UpdateInternalUserFieldValidationError,
} from './dto/update-internal-user.dto';

const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;

export interface NormalizedUpdateInternalUserInput {
  userId: string;
  password: string | null;
  role: InternalUserRole;
  status: InternalUserStatus;
  isActive: boolean;
}

// Validation stays explicit because the service applies business limitations
// after this point and should be able to trust the payload shape.
export function normalizeUpdateInternalUserInput(
  payload: UpdateInternalUserDto,
): NormalizedUpdateInternalUserInput {
  const errors: UpdateInternalUserFieldValidationError[] = [];
  const normalizedUserId =
    typeof payload?.userId === 'string'
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
  } else if (!USER_ID_PATTERN.test(normalizedUserId)) {
    errors.push({
      field: 'userId',
      message:
        'O User ID deve ter entre 4 e 30 caracteres e usar apenas letras minusculas, numeros, ponto, underscore ou hifen.',
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
    throw new BadRequestException({
      message: 'Existem erros de validacao.',
      errors,
    });
  }

  return {
    userId: normalizedUserId,
    password,
    role: role as InternalUserRole,
    status: status as InternalUserStatus,
    isActive: isActive as boolean,
  };
}

function parseRole(role: unknown): InternalUserRole | null {
  if (typeof role !== 'string') {
    return null;
  }

  const normalizedRole = role.trim().toUpperCase();

  switch (normalizedRole) {
    case InternalUserRole.IT:
      return InternalUserRole.IT;
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

function parseStatus(status: unknown): InternalUserStatus | null {
  if (typeof status !== 'string') {
    return null;
  }

  const normalizedStatus = status.trim().toUpperCase();

  switch (normalizedStatus) {
    case InternalUserStatus.ACTIVE:
      return InternalUserStatus.ACTIVE;
    case InternalUserStatus.PENDING_IT_VALIDATION:
      return InternalUserStatus.PENDING_IT_VALIDATION;
    case InternalUserStatus.BLOCKED:
      return InternalUserStatus.BLOCKED;
    default:
      return null;
  }
}

function parsePassword(
  password: unknown,
  errors: UpdateInternalUserFieldValidationError[],
): string | null {
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

function parseIsActive(isActive: unknown): boolean | null {
  return typeof isActive === 'boolean' ? isActive : null;
}
