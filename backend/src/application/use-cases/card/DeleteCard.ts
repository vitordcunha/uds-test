import { ICardRepository } from "../../interfaces/repositories/ICardRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class DeleteCard {
  constructor(private cardRepository: ICardRepository) {}

  async execute(id: string): Promise<void> {
    // Validate if card exists
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundError(`Card with id ${id} not found`);
    }

    // Delete via repository
    await this.cardRepository.delete(id);
  }
}
