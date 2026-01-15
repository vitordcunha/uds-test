import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { cards } from "../../../db/schema";
import { Card } from "../../../domain/entities/Card";
import { ICardRepository } from "../../../application/interfaces/repositories/ICardRepository";

export class CardRepository implements ICardRepository {
  async findById(id: string): Promise<Card | null> {
    const result = await db.select().from(cards).where(eq(cards.id, id));

    if (result.length === 0) return null;

    const cardData = result[0];
    return new Card(
      cardData.title,
      cardData.columnId,
      cardData.description ?? undefined,
      cardData.id
    );
  }

  async create(card: Card): Promise<Card> {
    const result = await db
      .insert(cards)
      .values({
        title: card.title,
        description: card.description,
        columnId: card.columnId,
      })
      .returning();

    const created = result[0];
    return new Card(
      created.title,
      created.columnId,
      created.description ?? undefined,
      created.id
    );
  }

  async update(card: Card): Promise<Card> {
    if (!card.id) {
      throw new Error("Card must have an id to be updated");
    }

    const result = await db
      .update(cards)
      .set({
        title: card.title,
        description: card.description,
        columnId: card.columnId,
      })
      .where(eq(cards.id, card.id))
      .returning();

    const updated = result[0];
    return new Card(
      updated.title,
      updated.columnId,
      updated.description ?? undefined,
      updated.id
    );
  }

  async delete(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }
}
