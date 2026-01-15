import { Board } from "../../../domain/entities/Board";
import { IBoardRepository } from "../../interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class GetBoardById {
  constructor(private boardRepository: IBoardRepository) {}

  async execute(id: string): Promise<Board> {
    const board = await this.boardRepository.findById(id);
    
    if (!board) {
      throw new NotFoundError(`Board with id ${id} not found`);
    }

    return board;
  }
}
