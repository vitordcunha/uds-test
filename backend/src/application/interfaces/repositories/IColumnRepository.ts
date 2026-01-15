import { Column } from '../../../domain/entities/Column';

export interface IColumnRepository {
  findById(id: string): Promise<Column | null>;
  create(column: Column): Promise<Column>;
}
