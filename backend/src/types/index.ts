import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { boards, columns, cards } from "../db/schema";

// Domain entities types - inferred from Drizzle schema
export type Board = InferSelectModel<typeof boards>;
export type Column = InferSelectModel<typeof columns>;
export type Card = InferSelectModel<typeof cards>;

// Insert types - for creating new records
export type InsertBoard = InferInsertModel<typeof boards>;
export type InsertColumn = InferInsertModel<typeof columns>;
export type InsertCard = InferInsertModel<typeof cards>;

// API request/response types
export interface CreateBoardRequest {
  name: string;
}

export interface CreateColumnRequest {
  name: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
}

export interface MoveCardRequest {
  newColumnId: string;
}
