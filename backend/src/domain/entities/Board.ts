import { BoardName } from "../value-objects/BoardName";

export class Board {
  private _id?: string;
  private _name: BoardName;
  private _columns: string[] = [];

  constructor(name: string, id?: string) {
    this._name = new BoardName(name);
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name.value;
  }

  hasColumn(columnId: string): boolean {
    return this._columns.includes(columnId);
  }

  addColumn(columnId: string): void {
    if (!this._columns.includes(columnId)) {
      this._columns.push(columnId);
    }
  }
}
