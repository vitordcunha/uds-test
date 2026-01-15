import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { boards, columns } from "../../../db/schema";
import { Board } from "../../../domain/entities/Board";
import { IBoardRepository } from "../../../application/interfaces/repositories/IBoardRepository";

export class BoardRepository implements IBoardRepository {
  async findAll(): Promise<Board[]> {
    const results = await db.select().from(boards);
    return results.map((b) => new Board(b.name, b.id));
  }

  async findById(id: string): Promise<Board | null> {
    const result = await db.select().from(boards).where(eq(boards.id, id));

    if (result.length === 0) return null;

    const boardData = result[0];
    return new Board(boardData.name, boardData.id);
  }

  async findByColumnId(columnId: string): Promise<Board | null> {
    const result = await db
      .select({ board: boards })
      .from(columns)
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .where(eq(columns.id, columnId));

    if (result.length === 0) return null;

    const boardData = result[0].board;
    const board = new Board(boardData.name, boardData.id);

    const boardColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardData.id));

    boardColumns.forEach((col) => board.addColumn(col.id));

    return board;
  }

  async create(board: Board): Promise<Board> {
    const result = await db
      .insert(boards)
      .values({
        name: board.name,
      })
      .returning();

    const created = result[0];
    return new Board(created.name, created.id);
  }
}
