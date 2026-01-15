import { Router } from "express";
import { CardController } from "../presentation/http/controllers/CardController";
import {
  validate,
  createCardSchema,
  createCardParamsSchema,
} from "../presentation/http/validators";

export const createCardsRouter = (cardController: CardController) => {
  const router = Router({ mergeParams: true });

  // POST /api/columns/:columnId/cards - Create a new card
  router.post(
    "/",
    validate({
      body: createCardSchema,
      params: createCardParamsSchema,
    }),
    (req, res, next) => cardController.create(req, res, next)
  );

  return router;
};
