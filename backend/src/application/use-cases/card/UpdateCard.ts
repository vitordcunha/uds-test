import { UpdateCardDTO } from "../../dtos/UpdateCardDTO";
import { Card } from "../../../domain/entities/Card";
import { ICardRepository } from "../../interfaces/repositories/ICardRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class UpdateCard {
  constructor(private cardRepository: ICardRepository) {}

  async execute(id: string, dto: UpdateCardDTO): Promise<Card> {
    // Find the card
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundError(`Card with id ${id} not found`);
    }

    // Update title and/or description using entity methods
    if (dto.title !== undefined) {
      card.updateTitle(dto.title);
    }
    if (dto.description !== undefined) {
      card.updateDescription(dto.description);
    }

    // Save via repository
    return await this.cardRepository.update(card);
  }
}
