import { Request, Response, NextFunction } from "express";
import logger from "../../../shared/logger/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  logger.http(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    ...(Object.keys(req.query).length > 0 && { query: req.query }),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "warn" : "http";

    logger[logLevel](`${req.method} ${req.path} ${res.statusCode}`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};
