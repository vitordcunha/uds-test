import { MoveCardDTO } from "../../dtos/MoveCardDTO";
import { Card } from "../../../domain/entities/Card";
import { ICardRepository } from "../../interfaces/repositories/ICardRepository";
import { IColumnRepository } from "../../interfaces/repositories/IColumnRepository";
import { IBoardRepository } from "../../interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class MoveCardBetweenColumns {
  constructor(
    private cardRepository: ICardRepository,
    private columnRepository: IColumnRepository,
    private boardRepository: IBoardRepository
  ) {}

  async execute(dto: MoveCardDTO): Promise<Card> {
    // 1. Find the card
    const card = await this.cardRepository.findById(dto.cardId);
    if (!card) {
      throw new NotFoundError(`Card with id ${dto.cardId} not found`);
    }

    // 2. Find the target column
    const targetColumn = await this.columnRepository.findById(
      dto.targetColumnId
    );
    if (!targetColumn) {
      throw new NotFoundError(`Column with id ${dto.targetColumnId} not found`);
    }

    // 3. Find the board of the target column
    const board = await this.boardRepository.findByColumnId(dto.targetColumnId);
    if (!board) {
      throw new NotFoundError("Board not found for target column");
    }

    // 4. Execute the business rule
    card.moveToColumn(dto.targetColumnId, board);

    // 5. Persist the change
    return await this.cardRepository.update(card);
  }
}
