import { ColumnName } from '../value-objects/ColumnName';

export class Column {
  private _id?: string;
  private _name: ColumnName;
  private _boardId: string;
  private _cards: string[] = [];
  private _order?: number;

  constructor(
    name: string,
    boardId: string,
    id?: string,
    order?: number
  ) {
    this._name = new ColumnName(name);
    this._boardId = boardId;
    this._id = id;
    this._order = order;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name.value;
  }

  get boardId(): string {
    return this._boardId;
  }

  get order(): number | undefined {
    return this._order;
  }

  hasCard(cardId: string): boolean {
    return this._cards.includes(cardId);
  }

  addCard(cardId: string): void {
    if (!this._cards.includes(cardId)) {
      this._cards.push(cardId);
    }
  }
}
