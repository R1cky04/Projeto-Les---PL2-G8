import { BadRequestException } from '@nestjs/common';
import { LoginDto, LoginFieldValidationError } from './dto/login.dto';

const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/;

export interface NormalizedLoginInput {
  userId: string;
  password: string;
}

// Login validation keeps controller logic thin and preserves a stable error
// shape for the frontend.
export function normalizeLoginInput(payload: LoginDto): NormalizedLoginInput {
  const errors: LoginFieldValidationError[] = [];
  const normalizedUserId =
    typeof payload?.userId === 'string'
      ? payload.userId.trim().toLowerCase()
      : '';
  const password =
    typeof payload?.password === 'string' ? payload.password.trim() : '';

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
  }

  if (errors.length > 0) {
    throw new BadRequestException({
      message: 'Existem erros de validacao no login.',
      errors,
    });
  }

  return {
    userId: normalizedUserId,
    password,
  };
}
