import { Request, Response, NextFunction } from "express";
import { MoveCardBetweenColumns } from "../../../application/use-cases/card/MoveCardBetweenColumns";

export class CardController {
  constructor(private moveCardUseCase: MoveCardBetweenColumns) {}

  async moveCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { newColumnId } = req.body;

      const card = await this.moveCardUseCase.execute({
        cardId: id,
        targetColumnId: newColumnId,
      });

      res.json({
        id: card.id,
        title: card.title,
        description: card.description,
        columnId: card.columnId,
      });
    } catch (error) {
      next(error);
    }
  }
}
