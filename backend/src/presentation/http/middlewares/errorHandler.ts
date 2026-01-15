import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { DomainException } from "../../../domain/exceptions/DomainException";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  BadRequestError,
  BaseError,
} from "../../../shared/errors";
import logger from "../../../shared/logger/logger";

const isDevelopment = process.env.NODE_ENV !== "production";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with context
  const errorContext = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.body,
    params: req.params,
    query: req.query,
  };

  // Handle known error types
  if (err instanceof BaseError) {
    logger.warn("Handled error", {
      error: {
        name: err.name,
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        details: err.details,
        stack: isDevelopment ? err.stack : undefined,
      },
      context: errorContext,
    });

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
        ...(isDevelopment && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle DomainException (legacy)
  if (err instanceof DomainException) {
    logger.warn("Domain exception", {
      error: {
        name: err.name,
        message: err.message,
        stack: isDevelopment ? err.stack : undefined,
      },
      context: errorContext,
    });

    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: "DOMAIN_ERROR",
        message: err.message,
        ...(isDevelopment && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle Zod validation errors (should be caught by validation middleware, but just in case)
  if (err.name === "ZodError") {
    logger.warn("Zod validation error", {
      error: {
        name: err.name,
        message: err.message,
        stack: isDevelopment ? err.stack : undefined,
      },
      context: errorContext,
    });

    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: (err as any).issues || [],
        ...(isDevelopment && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle database errors (PostgreSQL)
  if (err.name === "PostgresError" || err.message?.includes("database")) {
    logger.error("Database error", {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      context: errorContext,
    });

    const databaseError = new DatabaseError(
      "A database error occurred",
      isDevelopment ? { originalError: err.message } : undefined
    );

    return res.status(databaseError.statusCode).json({
      error: {
        code: databaseError.code,
        message: isDevelopment
          ? databaseError.message
          : "An internal error occurred",
        ...(isDevelopment && { details: databaseError.details }),
        ...(isDevelopment && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle unknown errors
  logger.error("Unhandled error", {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    context: errorContext,
  });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isDevelopment
        ? err.message
        : "An unexpected error occurred",
      ...(isDevelopment && { stack: err.stack }),
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};
