import { Router } from "express";
import { BoardController } from "../presentation/http/controllers/BoardController";

export const createBoardsRouter = (boardController: BoardController) => {
  const router = Router();

  // GET /api/boards - Get all boards
  router.get("/", (req, res, next) =>
    boardController.getAll(req, res, next)
  );

  // GET /api/boards/:id - Get board by ID
  router.get("/:id", (req, res, next) =>
    boardController.getById(req, res, next)
  );

  // POST /api/boards - Create a new board
  router.post("/", (req, res, next) =>
    boardController.create(req, res, next)
  );

  return router;
};
