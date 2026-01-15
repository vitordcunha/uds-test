import { Router } from "express";
import { BoardController } from "../presentation/http/controllers/BoardController";
import {
  validate,
  createBoardSchema,
  getBoardByIdParamsSchema,
} from "../presentation/http/validators";

export const createBoardsRouter = (boardController: BoardController) => {
  const router = Router();

  // GET /api/boards - Get all boards
  router.get("/", (req, res, next) => boardController.getAll(req, res, next));

  // GET /api/boards/:id - Get board by ID
  router.get(
    "/:id",
    validate({ params: getBoardByIdParamsSchema }),
    (req, res, next) => boardController.getById(req, res, next)
  );

  // POST /api/boards - Create a new board
  router.post("/", validate({ body: createBoardSchema }), (req, res, next) =>
    boardController.create(req, res, next)
  );

  return router;
};
