import { Router } from "express";
import { CardController } from "../presentation/http/controllers/CardController";

export const createCardsRouter = (cardController: CardController) => {
  const router = Router({ mergeParams: true });

  // POST /api/columns/:columnId/cards - Create a new card
  router.post("/", (req, res, next) =>
    cardController.create(req, res, next)
  );

  return router;
};
