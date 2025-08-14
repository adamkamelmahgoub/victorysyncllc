
import { z } from 'zod';

// Ensure values are safe to render in React
export function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// Common schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const accessCodeSchema = z.string()
  .min(6, 'Access code must be at least 6 characters')
  .max(50, 'Access code is too long')
  .regex(/^[A-Za-z0-9-_]+$/, 'Access code contains invalid characters');

export const totpCodeSchema = z.string()
  .length(6, 'Code must be exactly 6 digits')
  .regex(/^[0-9]+$/, 'Code must contain only numbers');

// Form validation helpers
export function getFieldError(
  errors: Record<string, any>,
  fieldName: string
): string | undefined {
  const error = errors[fieldName];
  if (!error) return undefined;
  if (typeof error.message === 'string') return error.message;
  return 'Invalid value';
}
