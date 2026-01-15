import { z } from 'zod';
import { DomainException } from '../exceptions/DomainException';

const BoardNameSchema = z
  .string()
  .min(1, 'Board name is required')
  .max(255, 'Board name must be less than 255 characters')
  .trim();

export class BoardName {
  private _value: string;

  constructor(value: string) {
    const result = BoardNameSchema.safeParse(value);
    if (!result.success) {
      throw new DomainException(result.error.issues[0].message);
    }
    this._value = result.data;
  }

  get value(): string {
    return this._value;
  }
}
