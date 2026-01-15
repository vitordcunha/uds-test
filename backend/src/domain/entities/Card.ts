import { DomainException } from "../exceptions/DomainException";
import { CardTitle } from "../value-objects/CardTitle";
import { Board } from "./Board";

export class Card {
  private _id?: string;
  private _title: CardTitle;
  private _description?: string;
  private _columnId: string;

  constructor(
    title: string,
    columnId: string,
    description?: string,
    id?: string
  ) {
    this._title = new CardTitle(title);
    this._columnId = columnId;
    this._description = description;
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }

  get title(): string {
    return this._title.value;
  }

  get description(): string | undefined {
    return this._description;
  }

  get columnId(): string {
    return this._columnId;
  }

  moveToColumn(targetColumnId: string, board: Board): void {
    if (!board.hasColumn(targetColumnId)) {
      throw new DomainException(
        "Card can only be moved between columns of the same board"
      );
    }
    this._columnId = targetColumnId;
  }

  updateTitle(title: string): void {
    this._title = new CardTitle(title);
  }

  updateDescription(description?: string): void {
    this._description = description;
  }
}
