import { Request, Response, NextFunction } from "express";
import { CreateBoard } from "../../../application/use-cases/board/CreateBoard";
import { GetAllBoards } from "../../../application/use-cases/board/GetAllBoards";
import { GetBoardById } from "../../../application/use-cases/board/GetBoardById";
import { IColumnRepository } from "../../../application/interfaces/repositories/IColumnRepository";
import { ICardRepository } from "../../../application/interfaces/repositories/ICardRepository";

export class BoardController {
  constructor(
    private createBoardUseCase: CreateBoard,
    private getAllBoardsUseCase: GetAllBoards,
    private getBoardByIdUseCase: GetBoardById,
    private columnRepository: IColumnRepository,
    private cardRepository: ICardRepository
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

      // Buscar colunas do board
      const columns = await this.columnRepository.findByBoardId(id!);

      // Buscar cards de cada coluna
      const columnsWithCards = await Promise.all(
        columns.map(async (column) => {
          const columnCards = await this.cardRepository.findByColumnId(
            column.id!
          );
          return {
            id: column.id,
            name: column.name,
            boardId: column.boardId,
            order: column.order,
            cards: columnCards.map((card) => ({
              id: card.id,
              title: card.title,
              description: card.description,
              columnId: card.columnId,
            })),
          };
        })
      );

      res.json({
        id: board.id,
        name: board.name,
        columns: columnsWithCards,
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
