import { BaseError } from "./BaseError";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends BaseError {
  constructor(
    message: string = "Bad request",
    details?: Record<string, any>
  ) {
    super(message, "BAD_REQUEST", StatusCodes.BAD_REQUEST, true, details);
  }
}
