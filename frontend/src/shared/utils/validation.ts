import { z } from 'zod';

export const createCardSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  description: z.string().optional(),
});

export const updateCardSchema = createCardSchema.partial();

export const createColumnSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
});

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
