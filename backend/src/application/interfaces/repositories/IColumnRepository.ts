import { Column } from '../../../domain/entities/Column';

export interface IColumnRepository {
  findById(id: string): Promise<Column | null>;
  findByBoardId(boardId: string): Promise<Column[]>;
  create(column: Column): Promise<Column>;
}
