import { BaseError } from "./BaseError";
import { StatusCodes } from "http-status-codes";

export class ValidationError extends BaseError {
  constructor(
    message: string = "Validation failed",
    details?: Record<string, any>
  ) {
    super(message, "VALIDATION_ERROR", StatusCodes.BAD_REQUEST, true, details);
  }
}
