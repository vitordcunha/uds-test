import { Router } from "express";
import { CardController } from "../presentation/http/controllers/CardController";
import {
  validate,
  updateCardSchema,
  updateCardParamsSchema,
  deleteCardParamsSchema,
  moveCardParamsSchema,
  moveCardBodySchema,
} from "../presentation/http/validators";

export const createCardOperationsRouter = (cardController: CardController) => {
  const router = Router();

  // PUT /api/cards/:id - Update a card
  router.put(
    "/:id",
    validate({
      body: updateCardSchema,
      params: updateCardParamsSchema,
    }),
    (req, res, next) => cardController.update(req, res, next)
  );

  // DELETE /api/cards/:id - Delete a card
  router.delete(
    "/:id",
    validate({ params: deleteCardParamsSchema }),
    (req, res, next) => cardController.delete(req, res, next)
  );

  // PATCH /api/cards/:id/move - Move card between columns
  router.patch(
    "/:id/move",
    validate({
      body: moveCardBodySchema,
      params: moveCardParamsSchema,
    }),
    (req, res, next) => cardController.moveCard(req, res, next)
  );

  return router;
};
