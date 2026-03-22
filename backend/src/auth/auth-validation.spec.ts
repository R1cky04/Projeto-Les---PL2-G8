import { BadRequestException } from '@nestjs/common';
import { normalizeLoginInput } from './auth-validation';

// Validation tests keep the external contract stable for the frontend.
describe('normalizeLoginInput', () => {
  it('normalizes the user id before authentication', () => {
    expect(
      normalizeLoginInput({
        userId: '  IT.Master  ',
        password: 'Secret123!',
      }),
    ).toEqual({
      userId: 'it.master',
      password: 'Secret123!',
    });
  });

  it('rejects incomplete login payloads', () => {
    expect(() =>
      normalizeLoginInput({
        userId: '',
        password: '',
      }),
    ).toThrow(BadRequestException);
  });
});
