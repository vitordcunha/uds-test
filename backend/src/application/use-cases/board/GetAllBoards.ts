import { Board } from "../../../domain/entities/Board";
import { IBoardRepository } from "../../interfaces/repositories/IBoardRepository";

export class GetAllBoards {
  constructor(private boardRepository: IBoardRepository) {}

  async execute(): Promise<Board[]> {
    return await this.boardRepository.findAll();
  }
}
