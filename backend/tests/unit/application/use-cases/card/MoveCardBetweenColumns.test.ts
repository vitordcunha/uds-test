import { MoveCardBetweenColumns } from "../../../../../src/application/use-cases/card/MoveCardBetweenColumns";
import { Card } from "../../../../../src/domain/entities/Card";
import { Board } from "../../../../../src/domain/entities/Board";
import { Column } from "../../../../../src/domain/entities/Column";
import { ICardRepository } from "../../../../../src/application/interfaces/repositories/ICardRepository";
import { IColumnRepository } from "../../../../../src/application/interfaces/repositories/IColumnRepository";
import { IBoardRepository } from "../../../../../src/application/interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../../../src/shared/errors/NotFoundError";
import { DomainException } from "../../../../../src/domain/exceptions/DomainException";

// Mocks
const mockCardRepo: jest.Mocked<ICardRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockColumnRepo: jest.Mocked<IColumnRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
};

const mockBoardRepo: jest.Mocked<IBoardRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
};

describe("MoveCardBetweenColumns Use Case", () => {
  let useCase: MoveCardBetweenColumns;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new MoveCardBetweenColumns(
      mockCardRepo,
      mockColumnRepo,
      mockBoardRepo
    );
  });

  it("should move card to another column in the same board", async () => {
    // Arrange
    const board = new Board("Test Board", "board-1");
    board.addColumn("column-1");
    board.addColumn("column-2");

    const card = new Card("Test Card", "column-1", undefined, "card-1");
    const targetColumn = new Column("Column 2", "board-1", "column-2");

    mockCardRepo.findById.mockResolvedValue(card);
    mockColumnRepo.findById.mockResolvedValue(targetColumn);
    mockBoardRepo.findByColumnId.mockResolvedValue(board);
    mockCardRepo.update.mockResolvedValue(card);

    // Act
    const result = await useCase.execute({
      cardId: "card-1",
      targetColumnId: "column-2",
    });

    // Assert
    expect(result.columnId).toBe("column-2");
    expect(mockCardRepo.update).toHaveBeenCalledWith(card);
  });

  it("should throw NotFoundError when card does not exist", async () => {
    mockCardRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ cardId: "invalid-id", targetColumnId: "column-2" })
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when target column does not exist", async () => {
    const card = new Card("Test Card", "column-1", undefined, "card-1");
    mockCardRepo.findById.mockResolvedValue(card);
    mockColumnRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ cardId: "card-1", targetColumnId: "invalid-column" })
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw DomainException when moving to column from different board", async () => {
    const board = new Board("Test Board", "board-1");
    board.addColumn("column-1");
    // column-2 NÃO está no board

    const card = new Card("Test Card", "column-1", undefined, "card-1");
    const targetColumn = new Column("Column 2", "board-2", "column-2");

    mockCardRepo.findById.mockResolvedValue(card);
    mockColumnRepo.findById.mockResolvedValue(targetColumn);
    mockBoardRepo.findByColumnId.mockResolvedValue(board);

    await expect(
      useCase.execute({ cardId: "card-1", targetColumnId: "column-2" })
    ).rejects.toThrow(DomainException);
  });
});
