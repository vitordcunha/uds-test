import { Router } from "express";
import { CardController } from "../presentation/http/controllers/CardController";

export const createCardOperationsRouter = (cardController: CardController) => {
  const router = Router();

  // PUT /api/cards/:id - Update a card
  router.put("/:id", (req, res, next) =>
    cardController.update(req, res, next)
  );

  // DELETE /api/cards/:id - Delete a card
  router.delete("/:id", (req, res, next) =>
    cardController.delete(req, res, next)
  );

  // PATCH /api/cards/:id/move - Move card between columns
  router.patch("/:id/move", (req, res, next) =>
    cardController.moveCard(req, res, next)
  );

  return router;
};
