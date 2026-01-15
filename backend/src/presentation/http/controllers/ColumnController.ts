import { Request, Response, NextFunction } from "express";
import { CreateColumn } from "../../../application/use-cases/column/CreateColumn";

export class ColumnController {
  constructor(private createColumnUseCase: CreateColumn) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, order } = req.body;
      const { boardId } = req.params;

      const column = await this.createColumnUseCase.execute({
        name,
        boardId,
        order,
      });

      res.status(201).json({
        id: column.id,
        name: column.name,
        boardId: column.boardId,
        order: column.order,
      });
    } catch (error) {
      next(error);
    }
  }
}
