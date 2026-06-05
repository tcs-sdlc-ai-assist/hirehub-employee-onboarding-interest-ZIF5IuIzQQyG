import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment
} from './validators.js';

describe('validateName', () => {
  it('returns error if name is empty', () => {
    expect(validateName('')).toMatch(/required/i);
    expect(validateName('   ')).toMatch(/required/i);
    expect(validateName(null)).toMatch(/required/i);
    expect(validateName(undefined)).toMatch(/required/i);
  });

  it('returns error if name is less than 2 chars', () => {
    expect(validateName('A')).toMatch(/at least 2/i);
  });

  it('returns error if name contains non-letters', () => {
    expect(validateName('John1')).toMatch(/only contain letters/i);
    expect(validateName('Jane!')).toMatch(/only contain letters/i);
    expect(validateName('J@ne')).toMatch(/only contain letters/i);
    expect(validateName('John_Doe')).toMatch(/only contain letters/i);
  });

  it('accepts valid names', () => {
    expect(validateName('John')).toBe('');
    expect(validateName('Jane Doe')).toBe('');
    expect(validateName('Mary Ann')).toBe('');
    expect(validateName('  Alice  ')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns error if email is empty', () => {
    expect(validateEmail('')).toMatch(/required/i);
    expect(validateEmail('   ')).toMatch(/required/i);
    expect(validateEmail(null)).toMatch(/required/i);
    expect(validateEmail(undefined)).toMatch(/required/i);
  });

  it('returns error if email is invalid', () => {
    expect(validateEmail('abc')).toMatch(/valid email/i);
    expect(validateEmail('abc@')).toMatch(/valid email/i);
    expect(validateEmail('abc@com')).toMatch(/valid email/i);
    expect(validateEmail('abc.com')).toMatch(/valid email/i);
    expect(validateEmail('abc@.com')).toMatch(/valid email/i);
    expect(validateEmail('abc@com.')).toMatch(/valid email/i);
    expect(validateEmail('abc@@def.com')).toMatch(/valid email/i);
    expect(validateEmail('abc@def@com')).toMatch(/valid email/i);
  });

  it('accepts valid emails', () => {
    expect(validateEmail('john@example.com')).toBe('');
    expect(validateEmail('jane.doe@company.co')).toBe('');
    expect(validateEmail('user+tag@domain.org')).toBe('');
    expect(validateEmail('  alice@foo.bar  ')).toBe('');
  });
});

describe('validateMobile', () => {
  it('returns error if mobile is empty', () => {
    expect(validateMobile('')).toMatch(/required/i);
    expect(validateMobile('   ')).toMatch(/required/i);
    expect(validateMobile(null)).toMatch(/required/i);
    expect(validateMobile(undefined)).toMatch(/required/i);
  });

  it('returns error if mobile is not all digits', () => {
    expect(validateMobile('12345abcde')).toMatch(/digits/);
    expect(validateMobile('123-456-7890')).toMatch(/digits/);
    expect(validateMobile('123 456 7890')).toMatch(/digits/);
    expect(validateMobile('123456789x')).toMatch(/digits/);
  });

  it('returns error if mobile is too short or too long', () => {
    expect(validateMobile('123456789')).toMatch(/10 to 15/);
    expect(validateMobile('1234567890123456')).toMatch(/10 to 15/);
  });

  it('accepts valid mobile numbers', () => {
    expect(validateMobile('1234567890')).toBe('');
    expect(validateMobile('9876543210987')).toBe('');
    expect(validateMobile('123456789012345')).toBe('');
    expect(validateMobile(' 1234567890 ')).toBe('');
  });
});

describe('validateDepartment', () => {
  it('returns error if department is empty', () => {
    expect(validateDepartment('')).toMatch(/required/i);
    expect(validateDepartment('   ')).toMatch(/required/i);
    expect(validateDepartment(null)).toMatch(/required/i);
    expect(validateDepartment(undefined)).toMatch(/required/i);
  });

  it('returns error if department is less than 2 chars', () => {
    expect(validateDepartment('A')).toMatch(/at least 2/i);
  });

  it('accepts valid department names', () => {
    expect(validateDepartment('Engineering')).toBe('');
    expect(validateDepartment('HR')).toBe('');
    expect(validateDepartment('IT')).toBe('');
    expect(validateDepartment('  Sales  ')).toBe('');
  });
});