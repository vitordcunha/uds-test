import { CreateColumnDTO } from "../../dtos/CreateColumnDTO";
import { Column } from "../../../domain/entities/Column";
import { IColumnRepository } from "../../interfaces/repositories/IColumnRepository";
import { IBoardRepository } from "../../interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class CreateColumn {
  constructor(
    private columnRepository: IColumnRepository,
    private boardRepository: IBoardRepository
  ) {}

  async execute(dto: CreateColumnDTO): Promise<Column> {
    // Validate if board exists
    const board = await this.boardRepository.findById(dto.boardId);
    if (!board) {
      throw new NotFoundError(`Board with id ${dto.boardId} not found`);
    }

    // Create Column entity (domain validation happens in constructor)
    const column = new Column(dto.name, dto.boardId, undefined, dto.order);

    // Save via repository
    return await this.columnRepository.create(column);
  }
}
