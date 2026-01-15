import { CreateColumn } from "../../../../../src/application/use-cases/column/CreateColumn";
import { Column } from "../../../../../src/domain/entities/Column";
import { Board } from "../../../../../src/domain/entities/Board";
import { IColumnRepository } from "../../../../../src/application/interfaces/repositories/IColumnRepository";
import { IBoardRepository } from "../../../../../src/application/interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../../../src/shared/errors/NotFoundError";

// Mocks
const mockColumnRepo: jest.Mocked<IColumnRepository> = {
  findById: jest.fn(),
  findByBoardId: jest.fn(),
  create: jest.fn(),
};

const mockBoardRepo: jest.Mocked<IBoardRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
};

describe("CreateColumn Use Case", () => {
  let useCase: CreateColumn;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateColumn(mockColumnRepo, mockBoardRepo);
  });

  it("should create a new column successfully", async () => {
    // Arrange
    const boardId = "board-1";
    const columnName = "Test Column";
    const board = new Board("Test Board", boardId);
    const createdColumn = new Column(columnName, boardId, "column-1");

    mockBoardRepo.findById.mockResolvedValue(board);
    mockColumnRepo.create.mockResolvedValue(createdColumn);

    // Act
    const result = await useCase.execute({
      name: columnName,
      boardId,
    });

    // Assert
    expect(result).toBeInstanceOf(Column);
    expect(result.name).toBe(columnName);
    expect(result.boardId).toBe(boardId);
    expect(mockBoardRepo.findById).toHaveBeenCalledWith(boardId);
    expect(mockColumnRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should create column with order when provided", async () => {
    // Arrange
    const boardId = "board-1";
    const columnName = "Test Column";
    const order = 1;
    const board = new Board("Test Board", boardId);
    const createdColumn = new Column(columnName, boardId, "column-1", order);

    mockBoardRepo.findById.mockResolvedValue(board);
    mockColumnRepo.create.mockResolvedValue(createdColumn);

    // Act
    const result = await useCase.execute({
      name: columnName,
      boardId,
      order,
    });

    // Assert
    expect(result.order).toBe(order);
    expect(mockColumnRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundError when board does not exist", async () => {
    // Arrange
    const boardId = "invalid-board-id";
    mockBoardRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute({
        name: "Test Column",
        boardId,
      })
    ).rejects.toThrow(NotFoundError);
    await expect(
      useCase.execute({
        name: "Test Column",
        boardId,
      })
    ).rejects.toThrow(`Board with id ${boardId} not found`);
    expect(mockBoardRepo.findById).toHaveBeenCalledWith(boardId);
    expect(mockColumnRepo.create).not.toHaveBeenCalled();
  });
});
