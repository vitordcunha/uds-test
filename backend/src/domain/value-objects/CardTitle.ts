import { z } from 'zod';
import { DomainException } from '../exceptions/DomainException';

const CardTitleSchema = z
  .string()
  .min(1, 'Card title is required')
  .max(255, 'Card title must be less than 255 characters')
  .trim();

export class CardTitle {
  private _value: string;

  constructor(value: string) {
    const result = CardTitleSchema.safeParse(value);
    if (!result.success) {
      throw new DomainException(result.error.issues[0].message);
    }
    this._value = result.data;
  }

  get value(): string {
    return this._value;
  }
}
