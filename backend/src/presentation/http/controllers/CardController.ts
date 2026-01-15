import { Request, Response, NextFunction } from "express";
import { MoveCardBetweenColumns } from "../../../application/use-cases/card/MoveCardBetweenColumns";
import { CreateCard } from "../../../application/use-cases/card/CreateCard";
import { UpdateCard } from "../../../application/use-cases/card/UpdateCard";
import { DeleteCard } from "../../../application/use-cases/card/DeleteCard";

export class CardController {
  constructor(
    private moveCardUseCase: MoveCardBetweenColumns,
    private createCardUseCase: CreateCard,
    private updateCardUseCase: UpdateCard,
    private deleteCardUseCase: DeleteCard
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const { columnId } = req.params;

      const card = await this.createCardUseCase.execute({
        title,
        description,
        columnId,
      });

      res.status(201).json({
        id: card.id,
        title: card.title,
        description: card.description,
        columnId: card.columnId,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const card = await this.updateCardUseCase.execute(id, {
        title,
        description,
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

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.deleteCardUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

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
