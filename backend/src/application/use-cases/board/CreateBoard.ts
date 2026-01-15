import { CreateBoardDTO } from "../../dtos/CreateBoardDTO";
import { Board } from "../../../domain/entities/Board";
import { IBoardRepository } from "../../interfaces/repositories/IBoardRepository";

export class CreateBoard {
  constructor(private boardRepository: IBoardRepository) {}

  async execute(dto: CreateBoardDTO): Promise<Board> {
    // Create Board entity (domain validation happens in constructor)
    const board = new Board(dto.name);

    // Save via repository
    return await this.boardRepository.create(board);
  }
}
