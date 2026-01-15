import { z } from 'zod';
import { DomainException } from '../exceptions/DomainException';

const ColumnNameSchema = z
  .string()
  .min(1, 'Column name is required')
  .max(255, 'Column name must be less than 255 characters')
  .trim();

export class ColumnName {
  private _value: string;

  constructor(value: string) {
    const result = ColumnNameSchema.safeParse(value);
    if (!result.success) {
      throw new DomainException(result.error.issues[0].message);
    }
    this._value = result.data;
  }

  get value(): string {
    return this._value;
  }
}
