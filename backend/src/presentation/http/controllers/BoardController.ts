import { Request, Response, NextFunction } from "express";
import { CreateBoard } from "../../../application/use-cases/board/CreateBoard";
import { GetAllBoards } from "../../../application/use-cases/board/GetAllBoards";
import { GetBoardById } from "../../../application/use-cases/board/GetBoardById";

export class BoardController {
  constructor(
    private createBoardUseCase: CreateBoard,
    private getAllBoardsUseCase: GetAllBoards,
    private getBoardByIdUseCase: GetBoardById
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const boards = await this.getAllBoardsUseCase.execute();

      res.json(
        boards.map((board) => ({
          id: board.id,
          name: board.name,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const board = await this.getBoardByIdUseCase.execute(id);

      res.json({
        id: board.id,
        name: board.name,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const board = await this.createBoardUseCase.execute({ name });

      res.status(201).json({
        id: board.id,
        name: board.name,
      });
    } catch (error) {
      next(error);
    }
  }
}
