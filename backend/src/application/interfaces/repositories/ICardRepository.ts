import { Card } from '../../../domain/entities/Card';

export interface ICardRepository {
  findById(id: string): Promise<Card | null>;
  create(card: Card): Promise<Card>;
  update(card: Card): Promise<Card>;
  delete(id: string): Promise<void>;
}
