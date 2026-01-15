import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { boards, columns, cards } from "../../../db/schema";

// Helper function to ensure string is not empty after trim
const nonEmptyString = (schema: z.ZodString, fieldName: string) =>
  schema
    .trim()
    .min(1, `${fieldName} is required and cannot be empty`)
    .refine((val) => val.trim().length > 0, {
      message: `${fieldName} cannot be only whitespace`,
    });

// Board Schemas
export const createBoardSchema = createInsertSchema(boards, {
  name: (schema: z.ZodString) =>
    nonEmptyString(schema, "Board name")
      .max(255, "Board name must be less than 255 characters")
      .refine(
        (val) => val.trim().length >= 1,
        { message: "Board name must contain at least 1 character" }
      ),
}).pick({ name: true });

export const getBoardByIdParamsSchema = z.object({
  id: z
    .string({
      required_error: "Board ID is required",
      invalid_type_error: "Board ID must be a string",
    })
    .uuid("Board ID must be a valid UUID"),
});

// Column Schemas
export const createColumnSchema = createInsertSchema(columns, {
  name: (schema: z.ZodString) =>
    nonEmptyString(schema, "Column name")
      .max(255, "Column name must be less than 255 characters")
      .refine(
        (val) => val.trim().length >= 1,
        { message: "Column name must contain at least 1 character" }
      ),
  order: (schema: z.ZodNumber) =>
    schema
      .int("Order must be an integer")
      .positive("Order must be a positive number")
      .optional(),
}).pick({ name: true, order: true });

export const createColumnParamsSchema = z.object({
  boardId: z
    .string({
      required_error: "Board ID is required",
      invalid_type_error: "Board ID must be a string",
    })
    .uuid("Board ID must be a valid UUID"),
});

// Card Schemas
export const createCardSchema = createInsertSchema(cards, {
  title: (schema: z.ZodTypeAny) =>
    nonEmptyString(schema as z.ZodString, "Card title")
      .max(255, "Card title must be less than 255 characters")
      .refine(
        (val) => val.trim().length >= 1,
        { message: "Card title must contain at least 1 character" }
      ),
  description: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .max(1000, "Description must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
}).pick({ title: true, description: true });

export const createCardParamsSchema = z.object({
  columnId: z
    .string({
      required_error: "Column ID is required",
      invalid_type_error: "Column ID must be a string",
    })
    .uuid("Column ID must be a valid UUID"),
});

export const updateCardSchema = createUpdateSchema(cards, {
  title: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .trim()
      .min(1, "Card title cannot be empty")
      .max(255, "Card title must be less than 255 characters")
      .refine(
        (val) => val.trim().length >= 1,
        { message: "Card title cannot be only whitespace" }
      )
      .optional(),
  description: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .max(1000, "Description must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
})
  .pick({ title: true, description: true })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined,
    {
      message: "At least one field (title or description) must be provided",
    }
  );

export const updateCardParamsSchema = z.object({
  id: z
    .string({
      required_error: "Card ID is required",
      invalid_type_error: "Card ID must be a string",
    })
    .uuid("Card ID must be a valid UUID"),
});

export const deleteCardParamsSchema = z.object({
  id: z
    .string({
      required_error: "Card ID is required",
      invalid_type_error: "Card ID must be a string",
    })
    .uuid("Card ID must be a valid UUID"),
});

export const moveCardParamsSchema = z.object({
  id: z
    .string({
      required_error: "Card ID is required",
      invalid_type_error: "Card ID must be a string",
    })
    .uuid("Card ID must be a valid UUID"),
});

export const moveCardBodySchema = z.object({
  newColumnId: z
    .string({
      required_error: "New column ID is required",
      invalid_type_error: "New column ID must be a string",
    })
    .uuid("New column ID must be a valid UUID"),
});
