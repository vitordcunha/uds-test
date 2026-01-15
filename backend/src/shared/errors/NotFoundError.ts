import { BaseError } from "./BaseError";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends BaseError {
  constructor(
    message: string = "Resource not found",
    details?: Record<string, any>
  ) {
    super(message, "NOT_FOUND", StatusCodes.NOT_FOUND, true, details);
  }
}
