import { CreateCardDTO } from "../../dtos/CreateCardDTO";
import { Card } from "../../../domain/entities/Card";
import { ICardRepository } from "../../interfaces/repositories/ICardRepository";
import { IColumnRepository } from "../../interfaces/repositories/IColumnRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class CreateCard {
  constructor(
    private cardRepository: ICardRepository,
    private columnRepository: IColumnRepository
  ) {}

  async execute(dto: CreateCardDTO): Promise<Card> {
    // Validate if column exists
    const column = await this.columnRepository.findById(dto.columnId);
    if (!column) {
      throw new NotFoundError(`Column with id ${dto.columnId} not found`);
    }

    // Create Card entity (domain validation happens in constructor)
    const card = new Card(dto.title, dto.columnId, dto.description);

    // Save via repository
    return await this.cardRepository.create(card);
  }
}
