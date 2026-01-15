import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

interface ValidationConfig {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
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
        req.params = await config.params.parseAsync(req.params);
      }

      // Validate query
      if (config.query) {
        req.query = await config.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid input data",
          details: errors,
        });
      }

      next(error);
    }
  };
};
