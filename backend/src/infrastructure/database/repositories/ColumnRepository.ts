import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { columns } from "../../../db/schema";
import { Column } from "../../../domain/entities/Column";
import { IColumnRepository } from "../../../application/interfaces/repositories/IColumnRepository";

export class ColumnRepository implements IColumnRepository {
  async findById(id: string): Promise<Column | null> {
    const result = await db.select().from(columns).where(eq(columns.id, id));

    if (result.length === 0) return null;

    const columnData = result[0];
    return new Column(
      columnData.name,
      columnData.boardId,
      columnData.id,
      columnData.order ?? undefined
    );
  }

  async create(column: Column): Promise<Column> {
    const result = await db
      .insert(columns)
      .values({
        name: column.name,
        boardId: column.boardId,
        order: column.order,
      })
      .returning();

    const created = result[0];
    return new Column(
      created.name,
      created.boardId,
      created.id,
      created.order ?? undefined
    );
  }
}
