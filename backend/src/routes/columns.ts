import { Router } from "express";
import { ColumnController } from "../presentation/http/controllers/ColumnController";
import {
  validate,
  createColumnSchema,
  createColumnParamsSchema,
} from "../presentation/http/validators";

export const createColumnsRouter = (columnController: ColumnController) => {
  const router = Router({ mergeParams: true });

  // POST /api/boards/:boardId/columns - Create a new column
  router.post(
    "/",
    validate({
      body: createColumnSchema,
      params: createColumnParamsSchema,
    }),
    (req, res, next) => columnController.create(req, res, next)
  );

  return router;
};
