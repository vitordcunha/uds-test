import { Request, Response, NextFunction } from "express";
import { DomainException } from "../../../domain/exceptions/DomainException";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof DomainException) {
    return res.status(400).json({
      error: "Bad Request",
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: "Not Found",
      message: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};
