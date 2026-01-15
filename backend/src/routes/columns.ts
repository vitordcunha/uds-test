import { Router } from "express";
import { ColumnController } from "../presentation/http/controllers/ColumnController";

export const createColumnsRouter = (columnController: ColumnController) => {
  const router = Router({ mergeParams: true });

  // POST /api/boards/:boardId/columns - Create a new column
  router.post("/", (req, res, next) =>
    columnController.create(req, res, next)
  );

  return router;
};
