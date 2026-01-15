import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import logger from "../../../shared/logger/logger";

interface ValidationConfig {
  body?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
}

export const validate = (config: ValidationConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (config.body) {
        req.body = await config.body.parseAsync(req.body);
      }

      // Validate params
      if (config.params) {
        const validatedParams = await config.params.parseAsync(req.params);
        req.params = validatedParams as typeof req.params;
      }

      // Validate query
      if (config.query) {
        const validatedQuery = await config.query.parseAsync(req.query);
        req.query = validatedQuery as typeof req.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => {
          const field = issue.path.length > 0 ? issue.path.join(".") : "root";
          return {
            field,
            message: issue.message,
            code: issue.code,
            ...(issue.code === "invalid_type" && {
              expected: issue.expected,
              received: issue.received,
            }),
          };
        });

        // Log validation error
        logger.warn("Validation error", {
          method: req.method,
          path: req.path,
          errors: errors.map((e) => `${e.field}: ${e.message}`).join(", "),
          ip: req.ip,
        });

        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: errors,
            timestamp: new Date().toISOString(),
            path: req.path,
          },
        });
      }

      // If it's not a ZodError, pass it to the error handler
      next(error);
    }
  };
};
