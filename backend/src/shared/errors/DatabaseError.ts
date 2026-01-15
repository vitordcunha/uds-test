import { BaseError } from "./BaseError";
import { StatusCodes } from "http-status-codes";

export class DatabaseError extends BaseError {
  constructor(
    message: string = "Database operation failed",
    details?: Record<string, any>
  ) {
    super(
      message,
      "DATABASE_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      details
    );
  }
}
