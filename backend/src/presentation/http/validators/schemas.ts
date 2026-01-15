import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { boards, columns, cards } from "../../../db/schema";

// Board Schemas - gerados do Drizzle
export const createBoardSchema = createInsertSchema(boards, {
  name: (schema: z.ZodString) =>
    schema
      .min(1, "Board name is required")
      .max(255, "Board name must be less than 255 characters")
      .trim(),
}).pick({ name: true }); // Remove id (auto-gerado)

export const getBoardByIdParamsSchema = z.object({
  id: z.string().uuid("Board ID must be a valid UUID"),
});

// Column Schemas - gerados do Drizzle
export const createColumnSchema = createInsertSchema(columns, {
  name: (schema: z.ZodString) =>
    schema
      .min(1, "Column name is required")
      .max(255, "Column name must be less than 255 characters")
      .trim(),
  order: (schema: z.ZodNumber) => schema.int().positive().optional(),
}).pick({ name: true, order: true }); // Remove id e boardId (vem do param)

export const createColumnParamsSchema = z.object({
  boardId: z.string().uuid("Board ID must be a valid UUID"),
});

// Card Schemas - gerados do Drizzle
export const createCardSchema = createInsertSchema(cards, {
  title: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .min(1, "Card title is required")
      .max(255, "Card title must be less than 255 characters")
      .trim(),
  description: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString).max(1000, "Description must be less than 1000 characters").optional(),
}).pick({ title: true, description: true }); // Remove id e columnId (vem do param)

export const createCardParamsSchema = z.object({
  columnId: z.string().uuid("Column ID must be a valid UUID"),
});

export const updateCardSchema = createUpdateSchema(cards, {
  title: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .min(1, "Card title is required")
      .max(255, "Card title must be less than 255 characters")
      .trim()
      .optional(),
  description: (schema: z.ZodTypeAny) =>
    (schema as z.ZodString)
      .max(1000, "Description must be less than 1000 characters")
      .optional(),
}).pick({ title: true, description: true }); // Remove id e columnId

export const updateCardParamsSchema = z.object({
  id: z.string().uuid("Card ID must be a valid UUID"),
});

export const deleteCardParamsSchema = z.object({
  id: z.string().uuid("Card ID must be a valid UUID"),
});

export const moveCardParamsSchema = z.object({
  id: z.string().uuid("Card ID must be a valid UUID"),
});

export const moveCardBodySchema = z.object({
  newColumnId: z.string().uuid("Column ID must be a valid UUID"),
});
