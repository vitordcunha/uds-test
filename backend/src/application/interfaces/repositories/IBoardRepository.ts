import { Board } from '../../../domain/entities/Board';

export interface IBoardRepository {
  findAll(): Promise<Board[]>;
  findById(id: string): Promise<Board | null>;
  findByColumnId(columnId: string): Promise<Board | null>;
  create(board: Board): Promise<Board>;
}
