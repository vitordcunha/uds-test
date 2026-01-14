import { pgTable, uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const boards = pgTable("boards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const columns = pgTable("columns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  order: integer("order").default(0),
});

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  columnId: uuid("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
});

// Relations
export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  column: one(columns, {
    fields: [cards.columnId],
    references: [columns.id],
  }),
}));
